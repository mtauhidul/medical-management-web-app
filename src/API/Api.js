/* eslint-disable no-else-return */
/* eslint-disable no-alert */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable import/no-cycle */
/* eslint-disable no-empty-function */
/* eslint-disable import/prefer-default-export */
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
        rooms: data.rooms,
    });

    toast.success(`Sequence created successfully`);
}

export async function countUpdate(pass) {
    const countRef = db.collection('dashboard').doc(pass.id);
    await countRef.update({ count: pass.value });
}

// Alert Add
export async function addAlert(data) {
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

            console.log('objectToupdate 1', JSON.stringify(objectToupdate, null, 4));

            console.log('objects 1', JSON.stringify(objects, null, 4));

            // let checkAlert =  objectToupdate.alert !== data.alert ? objectToupdate.alert :
            objects.forEach((r, idx) => {
                if (r.alert === objectToupdate.alert && objectToupdate.count < r.count) {
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
            objects[data.arrIndex].count = objects.filter((r) => r.alert === data.alert).length;

            console.log('objectToupdate 2', JSON.stringify(objectToupdate, null, 4));

            console.log('objects 2', JSON.stringify(objects, null, 4));

            // Update complete array with update copy of element we have
            // created in local javascript variable.
            // console.log(objects);
            db.collection('dashboard').doc(data.docId).update({ rooms: objects });
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

// // Reset All
// export async function resetAll(data) {
//     console.log(data);
//     // First data of the desired document
//     db.collection('dashboard')
//         .doc(data.docId)
//         .get()
//         .then((doc) => {
//             // Assign array to local javascript variable
//             let objects = doc.data().rooms;

//             // Assing desired element of object to local javascript variable
//             console.log(objects);
//             const objectToupdate = objects.map((room) => {
//                 room.alert = '';
//                 room.bg = '';
//                 room.border = '';
//             });
//             console.log(objectToupdate);

//             // Update field of the element assigned to local javascript variable

//             // reassign object to local array variable
//             objects = objectToupdate;

//             // Update complete array with update copy of element we have
//             // created in local javascript variable.
//             console.log(objects);
//             db.collection('dashboard').doc(data.docId).update({ rooms: objects });
//         });
// }
