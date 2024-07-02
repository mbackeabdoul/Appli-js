// Importation des modules Firebase nécessaires pour l'application
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { setDoc, doc, getFirestore, getDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuration de Firebase pour se connecter à la base de données Firestore
const firebaseConfig = {
    authDomain: "projets-validation.firebaseapp.com",
    projectId: "projets-validation",
    storageBucket: "projets-validation.appspot.com",
    messagingSenderId: "297716729138",
    appId: "1:297716729138:web:3315736ade8ba12957c32b",
};

// Initialisation de Firebase avec la configuration donnée
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialisation des variables globales
let students = [];
const NbreEtudiantsPage = 5; // Nombre d'étudiants par page
let PageCurrent = 1; // Page courante pour la pagination

// Fonction pour récupérer les étudiants depuis Firestore
async function fetchStudents() {
    try {
        const querySnapshot = await getDocs(collection(db, "students"));
        querySnapshot.forEach((doc) => {
            students.push(doc.data());
        });
        filtre(); // Filtrer et afficher les étudiants après récupération
    } catch (error) {
        console.error("Error fetching students: ", error);
    }
}

// Fonction pour calculer la moyenne des notes des étudiants
function Moyenne() {
    let Total = 0;
    for (const student of students) {
        Total += student.note;
    }
    return Total / students.length;
}

// Icônes pour les actions de suppression et modification
const supprimer = '<i class="fa-solid fa-trash fs-4 text-danger cursor-pointer"></i>';
const modifier = '<i class="fa-solid fa-pen-to-square fs-4 text-warning ms-3 cursor-pointer"></i>';

// Fonction pour afficher les étudiants dans le tableau HTML
function AfficheEtudiant(EtudiantAffiche) {
    const tbody = document.getElementById('Tbody');
    tbody.innerHTML = '';

    EtudiantAffiche.forEach(student => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${student.nom}</td>
            <td>${student.prenom}</td>
            <td>${student.note}</td>
            <td>${student.age}</td>
            <td>${modifier} ${supprimer}</td>
        `;
        tbody.appendChild(tr);

        // Gestionnaire d'événement pour la suppression d'un étudiant
        // const deleteIcon = tr.querySelector('.fa-trash');
        // deleteIcon.addEventListener('click', async () => {
        //     const index = students.indexOf(student);
        //     if (index !== -1) {
        //         students.splice(index, 1);
        //         await setDoc(doc(db, "students", student.id), student, { merge: true });
        //         filtre();
        //     }
        // });
        // Gestionnaire d'événement pour la suppression d'un étudiant
    const deleteIcon = tr.querySelector('.fa-trash');
    deleteIcon.addEventListener('click', async () => {
     const index = students.indexOf(student);
      if (index !== -1) {
        try {
            await deleteDoc(doc(db, "students", student.id)); // Suppression de l'étudiant dans Firestore
            students.splice(index, 1); // Suppression de l'étudiant du tableau local
            filtre(); // Mise à jour de l'affichage
        } catch (error) {
            console.error("Error deleting student: ", error);
        }
    }
});

        // Gestionnaire d'événement pour la modification d'un étudiant
        const editIcon = tr.querySelector('.fa-pen-to-square');
        editIcon.addEventListener('click', () => {
            document.getElementById('ajoutPrenom').value = student.prenom;
            document.getElementById('ajoutNom').value = student.nom;
            document.getElementById('ajoutAge').value = student.age;
            document.getElementById('ajoutNote').value = student.note;

            modal.style.display = 'block';
            envoyerModal.replaceWith(envoyerModal.cloneNode(true));
            envoyerModal = document.getElementById('envoyerModal');

            document.getElementById('envoyerModal').addEventListener('click', async () => {
                student.prenom = document.getElementById('ajoutPrenom').value;
                student.nom = document.getElementById('ajoutNom').value;
                student.age = parseInt(document.getElementById('ajoutAge').value);
                student.note = parseInt(document.getElementById('ajoutNote').value);
                await setDoc(doc(db, "students", student.id), student);
                filtre();
                modal.style.display = 'none';
                
            });
        });
    });
}

// Gestion du modal d'ajout/modification d'un étudiant
const modal = document.getElementById('modal');
document.getElementById('bouttonAjout').addEventListener('click', function (event) {
    event.preventDefault();
    modal.style.display = 'block';
});
document.getElementById('fermerModal').addEventListener('click', () => {
    modal.style.display = 'none';
    viderChamp();
});

// Gestionnaire d'événement pour l'ajout d'un nouvel étudiant
let envoyerModal = document.getElementById('envoyerModal')
envoyerModal.addEventListener('click', async () => {
    const ajoutPrenom = document.getElementById('ajoutPrenom').value;
    const ajoutNom = document.getElementById('ajoutNom').value;
    const ajoutAge = parseInt(document.getElementById('ajoutAge').value);
    const ajoutNote = parseInt(document.getElementById('ajoutNote').value);

    if (ajoutPrenom === '' || ajoutNom === '' || isNaN(ajoutAge) || isNaN(ajoutNote)) {
        alert("Veuillez remplir tous les champs avec des valeurs valides.");
    } else {
        const newStudent = {
            nom: ajoutNom,
            prenom: ajoutPrenom,
            age: ajoutAge,
            note: ajoutNote,
        };

        const docRef = doc(collection(db, "students"));
        await setDoc(docRef, { ...newStudent, id: docRef.id });
        students.push({ ...newStudent, id: docRef.id });
        localStorage.setItem('students', JSON.stringify(students));
        filtre();
        PageCurrent = 1;
    }
    modal.style.display = 'none';
    viderChamp();
    
});

// Fonction pour filtrer les étudiants affichés en fonction de la recherche et de la pagination
function filtre() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const EtudiantFiltres = students.filter(student =>
        student.nom.toLowerCase().includes(searchInput) || student.prenom.toLowerCase().includes(searchInput)
    );

    const startIndex = (PageCurrent - 1) * NbreEtudiantsPage;
    const EtudiantAffiche = EtudiantFiltres.slice(startIndex, startIndex + NbreEtudiantsPage);

    AfficheEtudiant(EtudiantAffiche);
    pagination(EtudiantFiltres);
    document.getElementById('MoyGen').innerText = Moyenne().toFixed(2);
    // Affichage de la somme des notes dans le premier card
    let resultCard1 = document.getElementById('card1');
    resultCard1.innerText = SommeNote();

    // Affichage de la somme des âges dans le deuxième card
    let resultCard2 = document.getElementById('card2');
    resultCard2.innerText = "La somme des âges est égale à " + SommeAge();

    // Affichage du nombre de notes dans le troisième card
    let resultCard3 = document.getElementById('card3');
    resultCard3.innerText = "Le nombre de notes est égal à " + compterNotes(students);

    // Affichage du nombre d'étudiants dans le quatrième card
    let resultCard4 = document.getElementById('card4');
    resultCard4.innerText = "Le nombre d'âges est égal à " + compterAge(students);

}

// Fonction pour gérer la pagination des étudiants
function pagination(EtudiantPagination) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(EtudiantPagination.length / NbreEtudiantsPage);

    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('a');
        pageItem.href = "#";
        pageItem.className = "page-link";
        pageItem.innerText = i;
        pageItem.onclick = function (event) {
            event.preventDefault();
            PageCurrent = i;
            filtre();
        };
        const pageLi = document.createElement('li');
        pageLi.className = "page-item";
        pageLi.appendChild(pageItem);
        pagination.appendChild(pageLi);
    }
}

// Fonction pour vider les champs du formulaire modal
function viderChamp() {
    document.getElementById('ajoutPrenom').value = '';
    document.getElementById('ajoutNom').value = '';
    document.getElementById('ajoutAge').value = '';
    document.getElementById('ajoutNote').value = '';
}

// Fonction pour calculer la somme des notes des étudiants
function SommeNote() {
    let totalNote = 0;
    for (const chaqueNote of students) {
        totalNote += chaqueNote.note;
    }
    return totalNote;
}


// Fonction pour calculer la somme des âges des étudiants
function SommeAge() {
    let totalAge = 0;
    for (const chaqueAge of students) {
        totalAge += chaqueAge.age;
    }
    return totalAge;
}


// Fonction pour compter le nombre de notes des étudiants
function compterNotes() {
    return students.length;
}


// Fonction pour compter le nombre d'étudiants
function compterAge() {
    return students.length;
}

// Chargement des étudiants au chargement de la page
window.onload = fetchStudents;



















// // Importation des modules Firebase nécessaires pour l'application

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { setDoc, doc, getFirestore, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// const firebaseConfig = {
//     authDomain: "projets-validation.firebaseapp.com",
//     projectId: "projets-validation",
//     storageBucket: "projets-validation.appspot.com",
//     messagingSenderId: "297716729138",
//     appId: "1:297716729138:web:3315736ade8ba12957c32b",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// let students = [];
// const NbreEtudiantsPage = 5;
// let PageCurrent = 1;

// async function fetchStudents() {
//     try {
//         const querySnapshot = await getDocs(collection(db, "students"));
//         querySnapshot.forEach((doc) => {
//             students.push(doc.data());
//         });
//         filtre();
//     } catch (error) {
//         console.error("Error fetching students: ", error);
//     }
// }

// function Moyenne() {
//     let Total = 0;
//     for (const student of students) {
//         Total += student.note;
//     }
//     return Total / students.length;
// }

// const supprimer = '<i class="fa-solid fa-trash fs-4 text-danger cursor-pointer"></i>';
// const modifier = '<i class="fa-solid fa-pen-to-square fs-4 text-warning ms-3 cursor-pointer"></i>';

// function AfficheEtudiant(EtudiantAffiche) {
//     const tbody = document.getElementById('Tbody');
//     tbody.innerHTML = '';

//     EtudiantAffiche.forEach(student => {
//         const tr = document.createElement('tr');
//         tr.innerHTML = `
//             <td>${student.nom}</td>
//             <td>${student.prenom}</td>
//             <td>${student.note}</td>
//             <td>${student.age}</td>
//             <td>${modifier} ${supprimer}</td>
//         `;
//         tbody.appendChild(tr);

//         const deleteIcon = tr.querySelector('.fa-trash');
//         deleteIcon.addEventListener('click', async () => {
//             const index = students.indexOf(student);
//             if (index !== -1) {
//                 students.splice(index, 1);
//                 await setDoc(doc(db, "students", student.id), student, { merge: true });
//                 filtre();
//             }
//         });

//         const editIcon = tr.querySelector('.fa-pen-to-square');
//         editIcon.addEventListener('click', () => {
//             document.getElementById('ajoutPrenom').value = student.prenom;
//             document.getElementById('ajoutNom').value = student.nom;
//             document.getElementById('ajoutAge').value = student.age;
//             document.getElementById('ajoutNote').value = student.note;

//             modal.style.display = 'block';
//             envoyerModal.replaceWith(envoyerModal.cloneNode(true));
//             envoyerModal = document.getElementById('envoyerModal');

//             document.getElementById('envoyerModal').addEventListener('click', async () => {
//                 student.prenom = document.getElementById('ajoutPrenom').value;
//                 student.nom = document.getElementById('ajoutNom').value;
//                 student.age = parseInt(document.getElementById('ajoutAge').value);
//                 student.note = parseInt(document.getElementById('ajoutNote').value);
//                 await setDoc(doc(db, "students", student.id), student);
//                 filtre();
//                 modal.style.display = 'none';
//             });
//         });
//     });
// }

// const modal = document.getElementById('modal');

// document.getElementById('bouttonAjout').addEventListener('click', function (event) {
//     event.preventDefault();
//     modal.style.display = 'block';
// });

// document.getElementById('fermerModal').addEventListener('click', () => {
//     modal.style.display = 'none';
//     viderChamp();
// });

// document.getElementById('envoyerModal').addEventListener('click', async () => {
//     const ajoutPrenom = document.getElementById('ajoutPrenom').value;
//     const ajoutNom = document.getElementById('ajoutNom').value;
//     const ajoutAge = parseInt(document.getElementById('ajoutAge').value);
//     const ajoutNote = parseInt(document.getElementById('ajoutNote').value);

//     if (ajoutPrenom === '' || ajoutNom === '' || isNaN(ajoutAge) || isNaN(ajoutNote)) {
//         alert("Veuillez remplir tous les champs avec des valeurs valides.");
//     } else {
//         const newStudent = {
//             nom: ajoutNom,
//             prenom: ajoutPrenom,
//             age: ajoutAge,
//             note: ajoutNote,
//         };

//         const docRef = doc(collection(db, "students"));
//         await setDoc(docRef, { ...newStudent, id: docRef.id });
//         students.push({ ...newStudent, id: docRef.id });
//         localStorage.setItem('students', JSON.stringify(students));
//         filtre();
//         PageCurrent = 1;
//     }
// });

// function filtre() {
//     const searchInput = document.getElementById('searchInput').value.toLowerCase();
//     const EtudiantFiltres = students.filter(student =>
//         student.nom.toLowerCase().includes(searchInput) || student.prenom.toLowerCase().includes(searchInput)
//     );

//     const startIndex = (PageCurrent - 1) * NbreEtudiantsPage;
//     const EtudiantAffiche = EtudiantFiltres.slice(startIndex, startIndex + NbreEtudiantsPage);

//     AfficheEtudiant(EtudiantAffiche);
//     pagination(EtudiantFiltres);
//     document.getElementById('MoyGen').innerText = Moyenne().toFixed(2);
// }

// function pagination(EtudiantPagination) {
//     const pagination = document.getElementById('pagination');
//     pagination.innerHTML = '';

//     const pageCount = Math.ceil(EtudiantPagination.length / NbreEtudiantsPage);

//     for (let i = 1; i <= pageCount; i++) {
//         const pageItem = document.createElement('a');
//         pageItem.href = "#";
//         pageItem.className = "page-link";
//         pageItem.innerText = i;
//         pageItem.onclick = function (event) {
//             event.preventDefault();
//             PageCurrent = i;
//             filtre();
//         };
//         const pageLi = document.createElement('li');
//         pageLi.className = "page-item";
//         pageLi.appendChild(pageItem);
//         pagination.appendChild(pageLi);
//     }
// }

// function viderChamp() {
//     document.getElementById('ajoutPrenom').value = '';
//     document.getElementById('ajoutNom').value = '';
//     document.getElementById('ajoutAge').value = '';
//     document.getElementById('ajoutNote').value = '';
// }

// function SommeNote() {
//     let totalNote = 0;
//     for (const chaqueNote of students) {
//         totalNote += chaqueNote.note;
//     }
//     return totalNote;
// }

// let resultCard1 = document.getElementById('card1');
// resultCard1.innerText = SommeNote();

// function SommeAge() {
//     let totalAge = 0;
//     for (const chaqueAge of students) {
//         totalAge += chaqueAge.age;
//     }
//     return totalAge;
// }

// let resultCard2 = document.getElementById('card2');
// resultCard2.innerText = "La somme des âges est égale à " + SommeAge();

// function compterNotes() {
//     return students.length;
// }

// let resultCard3 = document.getElementById('card3');
// resultCard3.innerText = "Le nombre de notes est égal à " + compterNotes(students);

// function compterAge() {
//     return students.length;
// }

// let resultCard4 = document.getElementById('card4');
// resultCard4.innerText = "Le nombre d'âges est égal à " + compterAge(students);

// window.onload = fetchStudents;
