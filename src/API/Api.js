import toast from 'react-hot-toast';
import { db } from './firebase';

// Define collection name as constant
const DASHBOARD_COLLECTION = 'dashboard';
const PATIENTS_COLLECTION = 'patientsData';

// Add Dashboard Data to database
export async function addDashData(data) {
  try {
    const docRef = db.collection(DASHBOARD_COLLECTION).doc(data.dr.id);
    await docRef.set({
      dr: data.dr.id,
      email: data.dr.email,
      phone: data.dr.phone,
      count: data.dr.count,
      rooms: data.rooms,
    });
    toast.success('Sequence created successfully!');
  } catch (error) {
    console.error('Error adding dashboard data', error);
    toast.error('Error adding dashboard data');
  }
}

// Update count in dashboard data
export async function countUpdate(pass) {
  try {
    const docRef = db.collection(DASHBOARD_COLLECTION).doc(pass.id);
    await docRef.update({ count: pass.value });
  } catch (error) {
    console.error('Error updating count', error);
    toast.error('Error updating count');
  }
}

// Update room status in dashboard data and update patient status in patient data collection in firebase database
export const updateStatusAndTimestamp = async (data) => {
  try {
    const dashboardDocRef = db.collection(DASHBOARD_COLLECTION).doc(data.docId);
    const dashboardDoc = await dashboardDocRef.get();
    const rooms = dashboardDoc.data().rooms;
    const roomToUpdate = rooms[data.arrIndex];
    const roomId = roomToUpdate.id;

    const patientsQuerySnapshot = await db
      .collection(PATIENTS_COLLECTION)
      .get();
    patientsQuerySnapshot.forEach((patientDoc) => {
      const patientData = patientDoc.data();
      const patientRoomId = patientData.room;

      if (
        patientRoomId === roomId &&
        patientData.status !== 'Completed' &&
        patientData.status !== ''
      ) {
        const kiosk = patientData.kiosk;
        const startTime = kiosk.timestamp;
        const endTime = new Date().toISOString();

        const date1 = new Date(startTime).valueOf();
        const date2 = new Date(endTime).valueOf();
        const durationMs = Math.abs(date2 - date1);
        const durationSec = durationMs / 1000;
        const durationMin = durationSec / 60;

        if (data.activityType === 'patient') {
          kiosk.activity_time.patient =
            kiosk.activity_time.patient + durationMin;
        } else if (data.activityType === 'doctor') {
          kiosk.activity_time.doctor = kiosk.activity_time.doctor + durationMin;
        } else if (data.activityType === 'staff') {
          kiosk.activity_time.staff = kiosk.activity_time.staff + durationMin;
        }

        kiosk.timestamp = new Date().toISOString();

        // Update patient data
        db.collection(PATIENTS_COLLECTION).doc(patientDoc.id).update({ kiosk });
      }
    });
  } catch (error) {
    console.error('Error updating status and timestamp', error);
  }
};

// Add alert to dashboard data
export async function addAlert(data) {
  const doc = await db.collection(DASHBOARD_COLLECTION).doc(data.docId).get();
  const objects = doc.data().rooms;
  const objectToUpdate = objects[data.arrIndex];

  // Decrease count of previous alert if it exists
  objects.forEach((obj, idx) => {
    if (
      obj.alert === objectToUpdate.alert &&
      objectToUpdate.count < obj.count
    ) {
      obj.count = obj.count > 1 ? obj.count - 1 : 1;
    } else if (obj.alert === data.alert && data.count < obj.count) {
      obj.count = obj.count > 1 ? obj.count - 1 : 1;
    }
  });

  // Update the object with new alert information
  objectToUpdate.alert = data.alert;
  objectToUpdate.bg = data.bg;
  objectToUpdate.border = data.border;
  objects[data.arrIndex] = objectToUpdate;
  objectToUpdate.count = objects.filter(
    (obj) => obj.alert === data.alert
  ).length;

  // Update the entire array in the document
  await db
    .collection(DASHBOARD_COLLECTION)
    .doc(data.docId)
    .update({ rooms: objects });

  if (data.alert === 'Patient Ready') {
    await setRoomForPatient();
  } else if (data.alert !== '') {
    await setOtherStatusForPatient();
  }

  async function setOtherStatusForPatient() {
    const response = await db
      .collection(DASHBOARD_COLLECTION)
      .doc(data.docId)
      .get();
    const allPatients = response.data().count;
    const targetPatient = allPatients.find(
      (patient) => patient.room === objectToUpdate.id
    );

    if (targetPatient) {
      await db
        .collection(PATIENTS_COLLECTION)
        .doc(targetPatient.id)
        .update({ status: data.alert });
    } else {
      console.log('Unable to update patient room status');
    }
  }

  async function setRoomForPatient() {
    const response = await db
      .collection(DASHBOARD_COLLECTION)
      .doc(data.docId)
      .get();
    const allPatients = response.data().count;
    const emptyPatient = allPatients.find((patient) => patient.room === '');

    if (emptyPatient) {
      emptyPatient.room = objectToUpdate.id;
      await db
        .collection(DASHBOARD_COLLECTION)
        .doc(data.docId)
        .update({ count: allPatients });
      await db
        .collection(PATIENTS_COLLECTION)
        .doc(emptyPatient.id)
        .update({ room: emptyPatient.room, status: 'Patient Ready' });
    } else {
      console.log('No empty patient');
    }
  }

  const targetObject = objectToUpdate;
  return targetObject;
}

// Toggle emergency status
export async function toggleEmergency(data) {
  try {
    const dashboardRef = db.collection(DASHBOARD_COLLECTION).doc(data.docId);
    const doc = await dashboardRef.get();

    if (!doc.exists) {
      throw new Error(`Document with id ${data.docId} does not exist.`);
    }

    const rooms = doc.data().rooms;
    const roomToUpdate = rooms[data.idx];

    // Copy the room object to avoid modifying the original data
    const updatedRoom = { ...roomToUpdate, blink: data.blink };
    const updatedRooms = [...rooms];
    updatedRooms[data.idx] = updatedRoom;

    await dashboardRef.update({ rooms: updatedRooms });
  } catch (error) {
    console.error(error);
  }
}

// Get all kiosk data from database
export async function getKioskData() {
  const dashboardRef = db.collection(DASHBOARD_COLLECTION);
  const snapshot = await dashboardRef.get();
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data;
}

// Add data to patientsData collection
export async function addPatientsData(data) {
  try {
    const response = await db.collection(PATIENTS_COLLECTION).add(data);
    toast.dismiss();
    toast.success('Data added successfully');
    return response;
  } catch (error) {
    toast.dismiss();
    toast.error(error.message);
    return error;
  }
}

// Get all data from patientsData collection
export async function getPatientsData() {
  const ref = db.collection(PATIENTS_COLLECTION);
  const snapshot = await ref.get();
  const data = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return data;
}

// Remove data from patientsData collection
export async function removePatientsData(id) {
  const ref = db.collection(PATIENTS_COLLECTION).doc(id);
  try {
    await ref.delete();
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const getPatientDetails = async (doctorId, roomId) => {
  const doc = await db.collection(DASHBOARD_COLLECTION).doc(doctorId).get();
  const patients = doc.data().count;
  const patient = patients.find((p) => p.room === roomId);
  return patient;
};

export const getStatus = async (roomId) => {
  const doc = await db.collection('rooms').doc(roomId).get();
  const status = doc.data().alert.name;
  return status;
};

export async function deletePatientData(id) {
  const ref = db.collection(PATIENTS_COLLECTION).doc(id);
  try {
    await ref.delete();
    toast.dismiss();
    toast.success('Deleted successfully');
    return true;
  } catch (error) {
    toast.dismiss();
    toast.error(error.message);
    return error;
  }
}

export const patientCheckIn = async (patient, id) => {
  const data = {
    patient: patient,
    timestamp: new Date().toISOString(),
    activity_time: {
      doctor: 0,
      patient: 0,
      staff: 0,
    },
    others: {
      appointment_date: {
        value: new Date().toLocaleDateString(),
        name: 'Appointment Date',
        priority: true,
      },
      appointment_start_time: {
        value: new Date().toLocaleTimeString(),
        name: 'Appointment Start Time',
        priority: true,
      },
      is_televisit: {
        value: 'No',
        name: 'Is Televisit',
        priority: false,
      },
      call_start_time: {
        value: '',
        name: 'Call Start Time',
        priority: false,
      },
      call_end_time: {
        value: '',
        name: 'Call End Time',
        priority: false,
      },
      call_duration: {
        value: '',
        name: 'Call Duration',
        priority: false,
      },
      encounter_id: {
        value: '',
        name: 'Encounter ID',
        priority: false,
      },
      Appointment_created_by: {
        value: patient.userInfo.fullName,
        name: 'Appointment Created By User',
        priority: false,
      },
      visit_type: {
        value: '',
        name: 'Visit Type',
        priority: true,
      },
      visit_status: {
        value: '',
        name: 'Visit Status',
        priority: true,
      },
      case_label: {
        value: '',
        name: 'Case Label',
        priority: true,
      },
      visit_count: {
        value: '1',
        name: 'Visit Count',
        priority: false,
      },
      patient_count: {
        value: '1',
        name: 'Patient Count',
        priority: false,
      },
      patient_name: {
        value: patient.userInfo.fullName,
        name: 'Patient Name',
        priority: true,
      },
      patient_first_name: {
        value: patient.userInfo.fullName.split(' ')[0],
        name: 'Patient First Name',
        priority: true,
      },
      patient_last_name: {
        value: patient.userInfo.fullName.split(' ')[1],
        name: 'Patient Last Name',
        priority: true,
      },
      patient_middle_initial: {
        value: '',
        name: 'Patient Middle Initial',
        priority: false,
      },
      patient_acct_no: {
        value: '',
        name: 'Patient Account Number',
        priority: false,
      },
      patient_dob: {
        value: `${patient.userInfo.day} ${patient.userInfo.month},${patient.userInfo.year}`,
        name: 'Patient DOB',
        priority: true,
      },
      patient_gender: {
        value: '',
        name: 'Patient Gender',
        priority: false,
      },
      patient_address_line_1: {
        value: patient.demographicsInfo.address,
        name: 'Patient Address Line 1',
        priority: false,
      },
      patient_address_line_2: {
        value: patient.demographicsInfo.address2,
        name: 'Patient Address Line 2',
        priority: false,
      },
      patient_city: {
        value: patient.demographicsInfo.city,
        name: 'Patient City',
        priority: false,
      },
      patient_state: {
        value: patient.demographicsInfo.state,
        name: 'Patient State',
        priority: false,
      },
      patient_zip: {
        value: patient.demographicsInfo.zipcode,
        name: 'Patient Zip Code',
        priority: false,
      },
      patient_full_address: {
        value:
          patient.demographicsInfo.address + ' ' + patient.userInfo.zipcode,
        name: 'Patient Full Address',
        priority: false,
      },
      patient_race: {
        value: '',
        name: 'Patient Race',
        priority: false,
      },
      patient_ethnicity: {
        value: '',
        name: 'Patient Ethnicity',
        priority: false,
      },
      patient_home_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Home Phone',
        priority: false,
      },
      patient_cell_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Cell Phone',
        priority: false,
      },
      patient_work_phone: {
        value: patient.demographicsInfo.phone,
        name: 'Patient Work Phone',
        priority: false,
      },
      patient_email: {
        value: patient.demographicsInfo.email,
        name: 'Patient E-mail',
        priority: false,
      },
      patient_status: {
        value: 'Active',
        name: 'Patient Status',
        priority: false,
      },
      dont_send_statements: {
        value: 'No',
        name: "Don't Send Statements",
        priority: false,
      },
      patient_deceased: {
        value: 'No',
        name: 'Patient Deceased',
        priority: false,
      },
      patient_age_group: {
        value: 'Between 18 - 64  Yrs',
        name: 'Patient Age Group',
        priority: false,
      },
      appointment_facility_name: {
        value: 'Your Total Foot Care Specialist',
        name: 'Appointment Facility Name',
        priority: true,
      },
      appointment_facility_pos: {
        value: '',
        name: 'Appointment Facility POS',
        priority: false,
      },
      appointment_facility_group_name: {
        value: 'Facility Not In Group',
        name: 'Appointment Facility Group Name',
        priority: false,
      },
      department_name: {
        value: 'Unknown',
        name: 'Department Name',
        priority: false,
      },
      practice_name: {
        value: 'Practice Not Defined',
        name: 'Practice Name',
        priority: false,
      },
      appointment_provider_name: {
        value: '',
        name: 'Appointment Provider Name',
        priority: true,
      },
      appointment_provider_npi: {
        value: '',
        name: 'Appointment Provider NPI',
        priority: false,
      },
      appointment_referring_provider_name: {
        value: '',
        name: 'Appointment Referring Provider Name',
        priority: false,
      },
      appointment_referring_provider_npi: {
        value: '',
        name: 'Appointment Referring Provider NPI',
        priority: false,
      },
      resource_provider_name: {
        value: '',
        name: 'Resource Provider Name',
        priority: true,
      },
      resource_provider_npi: {
        value: '',
        name: 'Resource Provider NPI',
        priority: false,
      },
      demographics_pcp_name: {
        value: '',
        name: 'Demographics PCP Name',
        priority: false,
      },
      demographics_pcp_npi: {
        value: '',
        name: 'Demographics PCP NPI',
        priority: false,
      },
      demographics_referring_provider_name: {
        value: '',
        name: 'Demographics Referring Provider Name',
        priority: false,
      },
      demographics_referring_provider_npi: {
        value: '',
        name: 'Demographics Referring Provider NPI',
        priority: false,
      },
      demographics_rendering_provider_name: {
        value: '',
        name: 'Demographics Rendering Provider Name',
        priority: false,
      },
      demographics_rendering_provider_npi: {
        value: '',
        name: 'Demographics Rendering Provider NPI',
        priority: false,
      },
      primary_insurance_name: {
        value: patient.primaryInsurance.insuranceName,
        name: 'Primary Insurance Name',
        priority: false,
      },
      primary_insurance_subscriber_no: {
        value: patient.primaryInsurance.memberId,
        name: 'Primary Insurance Subscriber No',
        priority: false,
      },
      secondary_insurance_name: {
        value: patient?.secondaryInsurance?.insuranceName || '',
        name: 'Secondary Insurance Name',
        priority: false,
      },
      secondary_insurance_subscriber_no: {
        value: patient?.secondaryInsurance?.memberId || '',
        name: 'Secondary Insurance Subscriber No',
        priority: false,
      },
      tertiary_insurance_name: {
        value: '',
        name: 'Tertiary Insurance Name',
        priority: false,
      },
      tertiary_insurance_subscriber_no: {
        value: '',
        name: 'Tertiary Insurance Subscriber No',
        priority: false,
      },
      sliding_fee_schedule: {
        value: '',
        name: 'Sliding Fee Schedule',
        priority: false,
      },
      total_visit_count: {
        value: '',
        name: 'Total(Visit Count)',
        priority: false,
      },
      count_distinct_patient_acct_no: {
        value: '',
        name: 'Count Distinct(Patient Acct No)',
        priority: false,
      },
    },
  };

  const patientsDataRef = db.collection(PATIENTS_COLLECTION);

  const updateResult = await patientsDataRef.doc(id).update({
    kiosk: data,
    arrTime: new Date().toISOString(),
  });

  if (updateResult !== undefined) {
    return;
  }

  const doctorsRef = db.collection(DASHBOARD_COLLECTION);
  const doctorsSnap = await doctorsRef.get();

  const doctors = doctorsSnap.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });

  const patientRef = db.collection(PATIENTS_COLLECTION).doc(id);
  const patientSnap = await patientRef.get();
  const patientData = patientSnap.data();

  if (patientData.data[45] && patientData.data[41]) {
    const patientDoctor = `${patientData.data[41].split(', ')[0]} ${
      patientData.data[41].split(', ')[1]
    }`;
    const doctor = doctors.find((d) => {
      return patientDoctor.toLowerCase().includes(d.id?.toLowerCase());
    });

    const isAvailable = doctor.count.filter((p) => {
      return `${p.patient.split(', ')[1]} ${p.patient.split(', ')[0]}`.includes(
        patientData.kiosk.others.Appointment_created_by.value
      );
    });

    if (isAvailable.length > 0) {
      return {
        id: patientSnap.id,
        status: 'Already checked-in',
      };
    } else {
      doctor.count.push({
        patient: patientData.data[13],
        id: patientSnap.id,
        appointment: patientData.data[1],
        room: '',
      });

      const updateResult = await doctorsRef.doc(doctor.id).update({
        count: doctor.count,
      });

      if (updateResult !== undefined) {
        return;
      }

      return {
        id: patientSnap.id,
        status: 'success',
      };
    }
  } else {
    return;
  }
};
