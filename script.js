// Tableau des étudiants (supposons qu'il est déjà défini)
let students = JSON.parse(localStorage.getItem('students'))
||[
    // { nom: "Mbacke", prenom: "Fatima", note: 12, age: 19 },
    // { nom: "Mbacke", prenom: "Moustapha", note: 20, age: 22 },
    // { nom: "Mbacke", prenom: "Cheikhouna", note: 18, age: 16 },
    // ... autres étudiants
];

const NbreEtudiantsPage = 5;
let PageCurrent = 1;

// Fonction pour calculer la moyenne des notes
function Moyenne() {
    let Total = 0;
    for (const student of students) {
        Total += student.note;
    }
    return Total / students.length;
}

// Définir les icônes comme des balises HTML
const supprimer = '<i class="fa-solid fa-trash fs-4 text-danger cursor-pointer"></i>';
const modifier = '<i class="fa-solid fa-pen-to-square fs-4 text-warning ms-3 cursor-pointer"></i>';

// Fonction pour afficher les étudiants dans le tableau
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

        // Ajouter des événements pour les icônes de modification et de suppression
        const deleteIcon = tr.querySelector('.fa-trash');
        deleteIcon.addEventListener('click', () => {
            const index = students.indexOf(student);
            if (index !== -1) {
                students.splice(index, 1); // Supprime l'étudiant du tableau students
                localStorage.setItem('students', JSON.stringify(students));
                filtre(); // Met à jour l'affichage
            }
        });

        const editIcon = tr.querySelector('.fa-pen-to-square');
        editIcon.addEventListener('click', () => {
            console.log('Modifier étudiant:', student);
            // Ajouter ici la logique pour modifier l'étudiant
            // Par exemple, ouvrir un formulaire de modification
            editIcon.addEventListener('click', () => {
                // Pré-remplir le formulaire avec les données de l'étudiant sélectionné
                document.getElementById('ajoutPrenom').value = student.prenom;
                document.getElementById('ajoutNom').value = student.nom;
                document.getElementById('ajoutAge').value = student.age;
                document.getElementById('ajoutNote').value = student.note;
            
                // Afficher le modal de modification (si nécessaire)
                modal.style.display = 'block';
                envoyerModal.replaceWith(envoyerModal.cloneNode(true));
                envoyerModal=document.getElementById('envoyerModal')

                // Écouter l'événement de soumission du formulaire de modification
                document.getElementById('envoyerModal').addEventListener('click', () => {
                    // Mettre à jour les données de l'étudiant sélectionné
                    student.prenom = document.getElementById('ajoutPrenom').value;
                    student.nom = document.getElementById('ajoutNom').value;
                    student.age = parseInt(document.getElementById('ajoutAge').value);
                    student.note = parseInt(document.getElementById('ajoutNote').value);
                    // Mettre à jour les données dans le tableau students
                    localStorage.setItem('students', JSON.stringify(students));
            
                    // Mettre à jour l'affichage des étudiants et recalculer la pagination
                    filtre();
            
                    // Fermer le modal après la modification
                    modal.style.display = 'none';
                });
            });
            
        });
    });
}
// afficher modal
const  modal = document.getElementById('modal')



// Soumission du formulaire pour ajouter un nouvel étudiant
// Ouvrir le modal lorsque le bouton "Ajouter" est cliqué

document.getElementById('bouttonAjout').addEventListener('click', function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page
    modal.style.display='block';
});

// fermer modal
document.getElementById('fermerModal').addEventListener('click', () => {
    modal.style.display = 'none';
    viderChamp(); // Réinitialiser les champs du formulaire si nécessaire
});

   // un autre evenement pour fermer le modal à partir du bouton fermer 
//    document.getElementById('closeModal').addEventListener('click', () =>{
//     modal.style.display='none';
//     viderChamp()
// })

document.getElementById('envoyerModal').addEventListener('click', () => {
    // Récupérer les valeurs du formulaire
    const ajoutPrenom = document.getElementById('ajoutPrenom').value;
    const ajoutNom = document.getElementById('ajoutNom').value;
    const ajoutAge = parseInt(document.getElementById('ajoutAge').value);
    const ajoutNote = parseInt(document.getElementById('ajoutNote').value);

    // Valider les données du formulaire
    if (ajoutPrenom === '' || ajoutNom === '' || isNaN(ajoutAge) || isNaN(ajoutNote)) {
        alert("Veuillez remplir tous les champs avec des valeurs valides.");
    }else{
           // Créer un nouvel objet étudiant
    const newStudent = {
        nom: ajoutNom,
        prenom: ajoutPrenom,
        age: ajoutAge,
        note: ajoutNote
    };

    // Ajouter le nouvel étudiant au tableau 'students'
    students.push(newStudent);

 

    // Mettre à jour l'affichage des étudiants et recalculer la pagination
    localStorage.setItem('students', JSON.stringify(students));

    // viderChamp();
    filtre();
    // modal.style.display = 'none';
    PageCurrent = 1; // Retour à la première page après l'ajout
    // filtre();
    }


});  





// Fonction de filtrage des étudiants
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
}

// Initialiser l'affichage des étudiants au chargement de la page
window.onload =  filtre();

// Fonction pour afficher la pagination
function pagination(EtudiantPagination) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(EtudiantPagination.length / NbreEtudiantsPage);

    // Parcourir le nombre de pages et créer les liens de pagination
    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('a');
        pageItem.href = "#"; // Lien vide pour l'exemple
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

// // fonctions somme des notes 
function SommeNote () {
    let totalNote = 0
    for (const chaqueNote of students){
        totalNote += chaqueNote.note
    }
    return totalNote
}
console.log(SommeNote());

let resultCard1 = document.getElementById('card1')
resultCard1.innerText = SommeNote();


// // fonctions somme des ages
function SommeAge () {
    let totalAge = 0
    for(const chaqueAge of students){
        totalAge += chaqueAge.age
    }
    return totalAge

}console.log(SommeAge());
let resultCard2 = document.getElementById('card2')
resultCard2.innerText = "La somme des ages est égal à " +SommeAge()

// fonctions nombre de notes
function compterNotes () {
    return students.length;
}
const NbreNote = compterNotes(students)
let resultCard3 = document.getElementById('card3')
resultCard3.innerText = "le nombre de note est égal à " +compterNotes(students);

// fonctions nombre d'ages
function compterAge (){
    return students.length;
}
const NbreAge= compterAge(students)
    let resultCard4 = document.getElementById('card4')
    resultCard4.innerText="Le nombre de ages est égale à " + compterAge(students)
