const students = [
    {nom: "Mbacke",prenom: "Fatima", note: 12, age :19},
    {nom: "Mbacke",prenom: "Moustapha", note: 20, age :22},
    {nom: "Mbacke",prenom: "Cheikhouna", note: 18, age :16},
    {nom: "Mbacke",prenom: "Elhadji", note: 16, age :23},
    {nom: "Mbacke",prenom: "Mariama", note: 14, age :25},
    {nom: "Mbacke",prenom: "Mountakha", note: 6, age :24},
    {nom: "Mbacke",prenom: "Khadija", note: 17, age :18},
    {nom: "Mbacke",prenom: "Zeynab", note: 8, age :17},
    {nom: "Mbacke",prenom: "Maimouna", note: 15, age :12},
    {nom: "Mbacke",prenom: "Saliou", note: 19, age :15},
];
const NbreEtudiantsPage = 5;
let PageCurrent = 1;

function Moyenne(){
    let Total= 0;
    for ( const student of students) {
        Total += student.note;
    }
    return Total / students.length;
}

// // utliser la boucle for pour afficher
// for (let i = 0; i < EtudiantAffiche.length; i++) {
//     const student = EtudiantAffiche[i];
//     const tr = document.createElement('tr');
//     tr.innerHTML = `<td>${student.nom}</td><td>${student.prenom}</td><td>${student.note}</td><td>${student.age}</td> `;
//     tbody.appendChild(tr);
// }

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
            // Ajoutez ici la logique pour supprimer l'étudiant
            const index = students.indexOf(student);
            if (index !== -1) {
                students.splice(index, 1); // Supprime l'étudiant du tableau students
                filtre(); // Met à jour l'affichage
            }
        });

        const editIcon = tr.querySelector('.fa-pen-to-square');
        editIcon.addEventListener('click', () => {
            // Ajoutez ici la logique pour modifier l'étudiant
            // Vous pouvez ouvrir un formulaire de modification ou faire d'autres actions nécessaires
            console.log('Modifier étudiant:', student);
        });
    });
}

// Assurez-vous que votre fonction `filtre()` est correctement définie pour filtrer et afficher les étudiants
// Elle devrait appeler `AfficheEtudiant` pour mettre à jour le tableau après chaque modification ou filtrage.

// Assurez-vous également d'initialiser votre page correctement, par exemple en appelant `filtre()` lors du chargement de la page.
window.onload = filtre;


// const supprimer = '<i class="fa-solid fa-trash fs-4 text-danger "></i>'
// const modifier = '<i class="fa-solid fa-pen-to-square fs-4 text-warning ms-3"></i>'
// console.log(supprimer);

// fontions pour afficher les etudiants
// function AfficheEtudiant(EtudiantAffiche){
//     const tbody = document.getElementById('Tbody');
//     tbody.innerHTML= '';

// // une autre utilisation de map
// EtudiantAffiche.map(student => {
//     const tr = document.createElement('tr');
//     tr.innerHTML = `<td>${student.nom}</td><td>${student.prenom}</td><td>${student.note}</td><td>${student.age}</td><td>${supprimer} ${modifier}</td>`;
//     tbody.appendChild(tr);

    
// });
// }
// utliser la boucle for pour afficher
// for (let i = 0; i < EtudiantAffiche.length; i++) {
//     const student = EtudiantAffiche[i];
//     const tr = document.createElement('tr');
//     tr.innerHTML = `<td>${student.nom}</td><td>${student.prenom}</td><td>${student.note}</td><td>${student.age}</td> `;
//     tbody.appendChild(tr);
// }

// paginations
function pagination (EtudiantPagination){
    const pagination =document.getElementById('pagination');
    pagination.innerHTML='';

    const pageCount = EtudiantPagination.length / NbreEtudiantsPage;

    //parcourir le nombre de page (=2) et mettre les liens de switch entre les paginations
    for (let i = 1; i <= pageCount; i++) {
        const pageItem = document.createElement('a'); // creer le lien
        pageItem.href= "a"; // lui mettre le href a #
        pageItem.className = "page-link"; // lui ajouter un classe.
        pageItem.innerText = i; // mnt changer le contenu pour le mettre à i c-a-d qu'il va correspondre au nombre d'itération
        pageItem.onclick = function(event){ //afficher la page correspondant au click du lien
            event.preventDefault();
            PageCurrent = i;
            filtre()
        };  
        const pageLi = document.createElement('li');
        pageLi.className = "page-item";
        pageLi.appendChild(pageItem);
        pagination.appendChild(pageLi)
    }
}
 function filtre (){
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const EtudiantFiltres = students.filter(student =>
        student.nom.toLowerCase().includes(searchInput) || student.prenom.toLowerCase().includes(searchInput)
    );

    const startIndex = (PageCurrent - 1) * NbreEtudiantsPage;
    const EtudiantAffiche = EtudiantFiltres.slice(startIndex, startIndex + NbreEtudiantsPage);

    AfficheEtudiant(EtudiantAffiche);
    pagination(EtudiantFiltres);
    document.getElementById('MoyGen').innerText = Moyenne();
 }

 document.getElementById('searchInput').addEventListener('input', () =>{
    PageCurrent= 1
    filtre();
 });

 window.onload = filtre;

//  afficher le modal 
// let buttonAjout = document.getElementById('bouttonAjout')
// let modal = document.getElementById('modal')
// console.log(buttonAjout);

// // evenment pour afficher le modal a partir du button ajouter
// buttonAjout.addEventListener('click', () =>{
//     modal.style.display="block";

//     // fonction autre evenments pour fermer le modal à partir du button former
//     document.getElementById('closeModal').addEventListener('click', () => {
//         modal.style.display="none"
//     });
// });

// Ouvrir le modal lorsque le bouton "Ajouter" est cliqué
let buttonAjout = document.getElementById('bouttonAjout');
let modal = new bootstrap.Modal(document.getElementById('modal'));

buttonAjout.addEventListener('click', () => {
    modal.show();
});

// Écouter l'événement de soumission du formulaire
document.getElementById('envoyerModal').addEventListener('click', (event) => {
    event.preventDefault(); // Empêcher la soumission du formulaire par défaut (si utilisé)

    // Récupérer les valeurs du formulaire (à compléter avec les IDs appropriés)
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const age = document.getElementById('age').value.trim();
    const note = document.getElementById('note').value.trim();

    // Valider les données du formulaire si nécessaire

    // Ajouter votre logique pour enregistrer les données (localStorage, etc.)
    
    // Réinitialiser le formulaire (à adapter avec les IDs appropriés)
    document.getElementById('prenom').value = '';
    document.getElementById('nom').value = '';
    document.getElementById('age').value = '';
    document.getElementById('note').value = '';

    // Fermer le modal après la soumission du formulaire
    modal.hide();

        // Ajouter l'étudiant au tableau 'students'
        students.push({ nom: nom, prenom: prenom, note: parseInt(note), age: parseInt(age) });

        // Réafficher les étudiants et recalculer la pagination
        PageCurrent = 1; // Retour à la première page après l'ajout
        filtre();
    
});

// // Réinitialiser le formulaire et fermer le modal lorsque celui-ci est complètement caché
// modal.element.addEventListener('hidden.bs.modal', () => {
//     // Réinitialiser le formulaire ici si nécessaire
// });


// fonctions somme des notes 
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


// fonctions somme des ages
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
    resultCard4.innerText="Le nombre de ages est égale à" + compterAge(students)
