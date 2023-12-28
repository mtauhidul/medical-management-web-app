import toast from 'react-hot-toast';
import { db } from './firebase';

// Add Dashboard Data to database
export async function addDashData(data) {
  const ref = db.collection('dashboard').doc(data.dr.id);
  // console.log(data);

  const res = await ref.set({
    dr: data.dr.id,
    email: data.dr.email,
    phone: data.dr.phone,
    count: data.dr.count,
    role: data.dr.role,
    rooms: data.rooms,
    waiting: data.dr.waiting,
  });

  toast.success(`Sequence created successfully`);
}

export async function countUpdate(pass) {
  const countRef = db.collection('dashboard').doc(pass.id);
  const res = await countRef.get();
  const data = res.data();
  const count = data.count;
  if (pass.value > count.length) {
    count.push({
      appointment: '',
      patient: '',
      id: '',
      room: '',
    });
    await countRef.update({ count: count });
  } else if (pass.value < count.length) {
    const removingItem = count.find(
      (item) =>
        item.id === '' &&
        item.appointment === '' &&
        item.patient === '' &&
        item.room === ''
    );
    const index = count.indexOf(removingItem);
    count.splice(index, 1);
    await countRef.update({ count: count });
  }
}

export async function waitingUpdate(pass) {
  console.log(pass);
  const countRef = db.collection('dashboard').doc(pass.id);
  const res = await countRef.get();
  const data = res.data();
  const count = data.count;
  await countRef.update({ waiting: count.length - 1 });
}

let types = [];

export const updateStatusAndTimestamp = async (data) => {
  db.collection('dashboard')
    .doc(data.docId)
    .get()
    // eslint-disable-next-line consistent-return
    .then((doc) => {
      // console.log(doc.data());
      // Assign array to local javascript variable
      const objects = doc.data().rooms;

      // Assing desired element of object to local javascript variable
      const objectToupdate = objects[data.arrIndex];
      // console.log('objectToupdate 1', JSON.stringify(objectToupdate, null, 4));

      const roomId = objectToupdate.id;

      db.collection('patientsData')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (
              doc.data().room === roomId &&
              doc.data().status !== 'Completed' &&
              doc.data().status !== ''
            ) {
              const kiosk = doc.data().kiosk;
              const now = new Date();
              const ISOString = now.toISOString();

              const startTime = new Date(kiosk.timestamp);

              const endTime = new Date(ISOString);
              // console.log(startTime, '||', endTime);

              const durationMs = endTime.getTime() - startTime.getTime();
              const durationMin = Math.floor(durationMs / 60000);
              const durationSec = Math.floor((durationMs % 60000) / 1000);
              const durationStr = `${durationMin}:${durationSec
                .toString()
                .padStart(2, '0')}`;

              const sumTime = (a, b) => {
                // console.log(a, b);
                // Set the two times to be added
                const time1 = a || '0:00';
                const time2 = b;

                // Convert each time to seconds
                const time1Sec =
                  Number(time1.split(':')[0]) * 60 +
                  Number(time1.split(':')[1]);
                const time2Sec =
                  Number(time2.split(':')[0]) * 60 +
                  Number(time2.split(':')[1]);

                // Calculate the total time in seconds
                const totalTimeSec = time1Sec + time2Sec;

                // Convert the total time back to minutes:seconds format
                const totalTimeMin = Math.floor(totalTimeSec / 60);
                const totalTimeSecFormatted = (totalTimeSec % 60)
                  .toString()
                  .padStart(2, '0');
                const totalTimeFormatted = `${totalTimeMin}:${totalTimeSecFormatted}`;

                // console.log(totalTimeFormatted);

                return totalTimeFormatted;
              };

              console.log(kiosk.activity_time.patient);

              types.unshift({
                id: roomId,
                type: data.activityType,
              });
              // console.log(types);

              if (types.filter((type) => type.id === roomId).length === 1) {
                kiosk.activity_time.patient = sumTime(
                  kiosk.activity_time.patient,
                  durationStr
                );

                kiosk.timestamp = new Date().toISOString();

                // Update data
                db.collection('patientsData').doc(doc.id).update({
                  kiosk: kiosk,
                });
              } else if (
                types.filter((type) => type.id === roomId).length === 2
              ) {
                kiosk.activity_time[
                  types.filter((type) => type.id === roomId)[1].type
                ] = sumTime(
                  kiosk.activity_time[
                    types.filter((type) => type.id === roomId)[1].type
                  ],
                  durationStr
                );

                kiosk.timestamp = new Date().toISOString();

                // Update data
                db.collection('patientsData').doc(doc.id).update({
                  kiosk: kiosk,
                });

                if (data.alert === '') {
                  const newTypes = types.filter((type) => type.id !== roomId);

                  types = newTypes;

                  return types;
                }
              } else if (
                types.filter((type) => type.id === roomId).length >= 3
              ) {
                kiosk.activity_time[
                  types.filter((type) => type.id === roomId)[1].type
                ] = sumTime(
                  kiosk.activity_time[
                    types.filter((type) => type.id === roomId)[1].type
                  ],
                  durationStr
                );

                kiosk.timestamp = new Date().toISOString();

                // Update data
                db.collection('patientsData').doc(doc.id).update({
                  kiosk: kiosk,
                });

                if (data.alert === '') {
                  const newTypes = types.filter((type) => type.id !== roomId);

                  types = newTypes;

                  return types;
                } else {
                  types.pop(
                    types.filter((type) => type.id === roomId)[
                      types.filter((type) => type.id === roomId).length - 1
                    ]
                  );

                  return types;
                }
              }
            }
          });
        });
    });
};

// Alert Add
export async function addAlert(data) {
  let targetObject = {};

  // console.log(data);
  // First data of the desired document
  db.collection('dashboard')
    .doc(data.docId)
    .get()
    // eslint-disable-next-line consistent-return
    .then((doc) => {
      // console.log(doc.data());
      // Assign array to local javascript variable
      const objects = doc.data().rooms;

      // Assing desired element of object to local javascript variable
      const objectToupdate = objects[data.arrIndex];
      targetObject = objectToupdate;

      // console.log('objectToupdate 1', JSON.stringify(objectToupdate, null, 4));

      // console.log('objects 1', JSON.stringify(objects, null, 4));

      // let checkAlert =  objectToupdate.alert !== data.alert ? objectToupdate.alert :
      objects.forEach((r, idx) => {
        if (
          r.alert === objectToupdate.alert &&
          objectToupdate.count < r.count
        ) {
          r.count = r.count && r.count > 1 ? r.count - 1 : 1;
        } else if (r.alert === data.alert && data.count < r.count) {
          r.count = r.count && r.count > 1 ? r.count - 1 : 1;
        }
      });

      // Update field of the element assigned to local javascript variable
      objectToupdate.alert = data.alert;
      objectToupdate.bg = data.bg;
      objectToupdate.border = data.border;

      // reassign object to local array variable
      objects[data.arrIndex] = objectToupdate;
      // console.log('CHECK DATA', objects, data.alert);
      objects[data.arrIndex].count = objects.filter(
        (r) => r.alert === data.alert
      ).length;

      // console.log('objectToupdate 2', JSON.stringify(objectToupdate, null, 4));

      // console.log('objects 2', JSON.stringify(objects, null, 4));

      // Update complete array with update copy of element we have
      // created in local javascript variable.
      // console.log(objects);
      db.collection('dashboard').doc(data.docId).update({ rooms: objects });

      const completeTreatments = async () => {
        const response = await db.collection('dashboard').doc(data.docId).get();

        const allPatients = response.data().count;

        const completingPatient = allPatients.find(
          (p) => p.room === objectToupdate.id
        );

        if (completingPatient) {
          const updatedPatients = allPatients.filter(
            (patient) => patient !== completingPatient
          );

          db.collection('dashboard')
            .doc(data.docId)
            .update({ count: updatedPatients });

          const patientToUpdate = await db
            .collection('patientsData')
            .doc(completingPatient.id)
            .get();

          // const startTime = patientToUpdate.data().arrTime;
          // const endTime = new Date().toISOString();
          // let current = new Date(endTime).valueOf();
          // let previous = new Date(startTime).valueOf();
          // let diff = current - previous;
          // let mins = Math.round((diff % 3600000) / 60000);
          // let hours = Math.floor(diff / 3600000);
          // const duration = `${hours}:${mins}`;

          const kiosk = patientToUpdate.data().kiosk;
          const now = new Date();
          const ISOString = now.toISOString();

          const startTime = new Date(patientToUpdate.data().arrTime);

          const endTime = new Date(ISOString);
          // console.log(startTime, '||', endTime);

          const durationMs = endTime.getTime() - startTime.getTime();
          const durationMin = Math.floor(durationMs / 60000);
          const durationSec = Math.floor((durationMs % 60000) / 1000);
          const durationStr = `${durationMin}:${durationSec
            .toString()
            .padStart(2, '0')}`;

          const sumTime = (a, b) => {
            // console.log(a, b);
            // Set the two times to be added
            const time1 = a || '0:00';
            const time2 = b;

            // Convert each time to seconds
            const time1Sec =
              Number(time1.split(':')[0]) * 60 + Number(time1.split(':')[1]);
            const time2Sec =
              Number(time2.split(':')[0]) * 60 + Number(time2.split(':')[1]);

            // Calculate the total time in seconds
            const totalTimeSec = time1Sec + time2Sec;

            // Convert the total time back to minutes:seconds format
            const totalTimeMin = Math.floor(totalTimeSec / 60);
            const totalTimeSecFormatted = (totalTimeSec % 60)
              .toString()
              .padStart(2, '0');
            const totalTimeFormatted = `${totalTimeMin}:${totalTimeSecFormatted}`;

            // console.log(totalTimeFormatted);

            return totalTimeFormatted;
          };

          console.log(kiosk);

          if (kiosk && kiosk.activity_time) {
            kiosk.activity_time.patient = durationStr;
          } else {
            console.error('Error: kiosk or activity_time is not defined');
          }

          // patientToUpdate.data().room = emptyPatient.room;
          // patientToUpdate.data().status = 'Patient Ready';
          db.collection('patientsData')
            .doc(completingPatient.id)
            .update({ room: '', status: 'Completed', kiosk: kiosk });
        } else {
          // console.log('No empty patient');
        }
      };

      const setOtherStatusForPatient = async () => {
        const response = await db.collection('dashboard').doc(data.docId).get();

        const allPatients = response.data().count;

        const targetPatient = allPatients.find(
          (p) => p.room === objectToupdate.id
        );

        if (targetPatient) {
          // patientToUpdate.data().room = emptyPatient.room;
          // patientToUpdate.data().status = 'Patient Ready';
          db.collection('patientsData')
            .doc(targetPatient.id)
            .update({ status: data.alert });
        } else {
          // console.log('Unable to update patient room status');
        }
      };

      const setRoomForPatient = async () => {
        const response = await db.collection('dashboard').doc(data.docId).get();

        const allPatients = response.data().count;

        const emptyPatient = allPatients.find((p) => p.room === '');

        // console.log(emptyPatient);

        if (emptyPatient?.id) {
          emptyPatient.room = objectToupdate.id;

          db.collection('dashboard')
            .doc(data.docId)
            .update({ count: allPatients });

          await db.collection('patientsData').doc(emptyPatient.id).get();

          // console.log(patientToUpdate.data());

          // patientToUpdate.data().room = emptyPatient.room;
          // patientToUpdate.data().status = 'Patient Ready';
          db.collection('patientsData')
            .doc(emptyPatient.id)
            .update({ room: emptyPatient.room, status: 'Patient Ready' });
        } else {
          // console.log('No empty patient');
        }
      };
      if (data.alert === 'Patient Ready') {
        setRoomForPatient();
      }
      if (data.alert !== 'Patient Ready') {
        setOtherStatusForPatient();
      }
      if (data.alert === '') {
        completeTreatments();
      }
    });
}

export async function toggleEmergency(data) {
  // console.log(data);
  // First data of the desired document
  db.collection('dashboard')
    .doc(data.docId)
    .get()
    .then((doc) => {
      // console.log(doc.data());
      // Assign array to local javascript variable
      const objects = doc.data().rooms;

      // Assing desired element of object to local javascript variable
      const objectToupdate = objects[data.idx];

      // Update field of the element assigned to local javascript variable
      objectToupdate.blink = data.blink;

      // reassign object to local array variable
      objects[data.idx] = objectToupdate;
      // console.log('CHECK DATA', objects, data.alert);

      // Update complete array with update copy of element we have
      // created in local javascript variable.
      // console.log(objects);

      db.collection('dashboard').doc(data.docId).update({ rooms: objects });
    });
}

// Get all kiosk data from database
export async function getKioskData() {
  const ref = db.collection('dashboard');
  const snapshot = await ref.get();
  const data = [];
  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

// // Reset All
// export async function resetAll(data) {
//     // console.log(data);
//     // First data of the desired document
//     db.collection('dashboard')
//         .doc(data.docId)
//         .get()
//         .then((doc) => {
//             // Assign array to local javascript variable
//             let objects = doc.data().rooms;

//             // Assing desired element of object to local javascript variable
//             // console.log(objects);
//             const objectToupdate = objects.map((room) => {
//                 room.alert = '';
//                 room.bg = '';
//                 room.border = '';
//             });
//             // console.log(objectToupdate);

//             // Update field of the element assigned to local javascript variable

//             // reassign object to local array variable
//             objects = objectToupdate;

//             // Update complete array with update copy of element we have
//             // created in local javascript variable.
//             // console.log(objects);
//             db.collection('dashboard').doc(data.docId).update({ rooms: objects });
//         });
// }

// Add data to patientsData collection
export async function addPatientsData(data, index, lastIndex) {
  // console.log(data, index, lastIndex);
  const ref = db.collection('patientsData');
  if (data) {
    try {
      const response = await ref.add(data);
      if (response && index === lastIndex) {
        toast.dismiss();
        toast.success('Data added successfully');
        return response;
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      return error;
    }
  }
}

// Get all data from patientsData collection
export async function getPatientsData() {
  const ref = db.collection('patientsData');
  const snapshot = await ref.get();
  const data = [];
  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });

  return data;
}

// Remove all data from patientsData
export async function removeAllPatientsData(id, index, lastIndex) {
  // console.log(id, index, lastIndex);
  const ref = db.collection('patientsData');
  try {
    const response = await ref.doc(id).delete();
    if (response === undefined && index === lastIndex) {
      toast.dismiss();
      toast.success('Deleted successfully');
      return true;
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export const getPatientDetails = async (doctorId, roomId) => {
  return await db
    .collection('dashboard')
    .doc(doctorId)
    .get()
    .then((doc) => {
      const patients = doc.data()?.count;
      // console.log('CHECK PATIENTS', patients);
      const patient = patients?.filter((p) => p?.room === roomId);

      return patient[0];
    });
};

export const getStatus = async (roomId) => {
  return await db
    .collection('rooms')
    .doc(roomId)
    .onSnapshot((doc) => {
      const status = doc.data().alert.name;
      return status;
    });
};

// Delete a document from a collection patientsData by id
export async function deletePatientData(id) {
  // console.log(id);
  const ref = db.collection('patientsData');
  try {
    const response = await ref.doc(id).delete();
    // console.log(response);
    if (response === undefined) {
      toast.dismiss();
      toast.success('Deleted successfully');
      return true;
    }
  } catch (error) {
    toast.dismiss();
    toast.error(error.message);
  }
}

// Manually login patient
export const patientCheckIn = async (patient, id) => {
  const now = new Date();
  const isoString = now.toISOString();

  const data = {
    patient: patient,
    timestamp: isoString,
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
        value: `${
          patient.userInfo.day +
          ' ' +
          patient.userInfo.month +
          ',' +
          patient.userInfo.year
        }`,
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

  const patientsDataRef = db.collection('patientsData');

  const response = await patientsDataRef.doc(id).update({
    kiosk: data,
    arrTime: new Date().toISOString(),
  });

  if (response === undefined) {
    const doctors = [];

    const newRef = db.collection('dashboard');
    const newSnapshot = await newRef.get();

    newSnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      doctors.push(data);

      return doctors;
    });

    // console.log({ doctors });

    const patientRef = db.collection('patientsData');
    const docSnap = await patientRef.doc(id).get();

    const fetchedData = docSnap.data();

    // console.log(fetchedData.data[45]);

    if (fetchedData.data[45]) {
      if (fetchedData.data[41]) {
        const patientDoctor = `${fetchedData.data[41].split(', ')[0]} ${
          fetchedData.data[41].split(', ')[1]
        }`;

        const doctor = doctors.find((d) => {
          return patientDoctor.toLowerCase().includes(d.id?.toLowerCase());
        });

        // console.log({ patientDoctor, doctor });

        // console.log(fetchedData.kiosk.others.Appointment_created_by.value);

        const isAvailable = doctor.count.filter((p) => {
          return `${p.patient.split(', ')[1]} ${
            p.patient.split(', ')[0]
          }`.includes(fetchedData.kiosk.others.Appointment_created_by.value);
        });

        // console.log({ isAvailable });

        // console.log(isAvailable);
        if (isAvailable.length > 0) {
          const returnPatient = {
            id: docSnap.id,
            status: 'Already checked-in',
          };
          return returnPatient;
        } else {
          const patientsList =
            JSON.parse(localStorage.getItem('patientsList')) || [];

          patientsList.push({
            patient: docSnap.data().data[13],
            doctor: fetchedData.kiosk.others.Appointment_created_by.value,
          });

          localStorage.setItem('patientsList', JSON.stringify(patientsList));

          const updateRef = db.collection('dashboard').doc(doctor.id);
          doctor.count.push({
            patient: docSnap.data().data[13],
            id: docSnap.id,
            appointment: docSnap.data().data[1],
            room: '',
          });

          const updateRes = await updateRef.update({
            count: doctor.count,
            waiting: doctor.waiting + 1,
          });
          if (updateRes === undefined) {
            const returnPatient = { id: docSnap.id, status: 'success' };
            return returnPatient;
          }
        }
      }
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!');
    }
    doctors.length = 0;
  }
};

export const countDown = (doc) => {
  if (doc.count === 0) {
    toast.error("Patients can't be less than zero");
  } else {
    countUpdate({
      id: doc.id,
      value: doc.count - 1,
    });
  }
};
