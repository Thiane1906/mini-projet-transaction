"use strict";
let tel = document.querySelector("#inputEmail4");
let nomComplet = document.querySelector("#inputPassword4");
let montant = document.getElementById("solde");
const valider = document.querySelector('.btn');
const SelectFournisseur = document.getElementById('selectF');
const SelectTransaction = document.getElementById('selectT');
let destinataire = document.querySelector(".destinataire");
let historique = document.querySelector('#historique');
let modal = document.querySelector('#modal');
let ul = document.querySelector(".list-group");
modal.style.display = 'none';
//*****************notification********************* */
let showNotif = (msg) => {
    let notif = document.querySelector(".notif");
    notif.textContent = msg;
    notif.classList.add("show");
    setTimeout(() => {
        notif.classList.remove("show");
    }, 2000);
};
var Fournisseur;
(function (Fournisseur) {
    Fournisseur[Fournisseur["OM"] = 0] = "OM";
    Fournisseur[Fournisseur["WV"] = 1] = "WV";
    Fournisseur[Fournisseur["WR"] = 2] = "WR";
    Fournisseur[Fournisseur["CB"] = 3] = "CB";
})(Fournisseur || (Fournisseur = {}));
var Transaction;
(function (Transaction) {
    Transaction[Transaction["depot"] = 0] = "depot";
    Transaction[Transaction["retrait"] = 1] = "retrait";
    Transaction[Transaction["transfert"] = 2] = "transfert";
})(Transaction || (Transaction = {}));
for (const fournisseur in Fournisseur) {
    if (isNaN(Number(fournisseur))) {
        const option = document.createElement('option');
        option.textContent = fournisseur;
        SelectFournisseur.appendChild(option);
    }
}
for (const transaction in Transaction) {
    if (isNaN(Number(transaction))) {
        const option = document.createElement('option');
        option.textContent = transaction;
        SelectTransaction.appendChild(option);
    }
}
fetch("http://127.0.0.1:8000/api/compte", {
    method: 'GET',
})
    .then(function (response) {
    return response.json();
})
    .then((data) => {
    const Data = data.data;
    console.log(Data);
    Data.forEach((element) => {
        tel.addEventListener('input', () => {
            if (+tel.value == element.téléphone || tel.value == element.NumCompte) {
                nomComplet.value = element.Nom + " " + element.Prenom;
                montant.addEventListener('input', () => {
                    if (+montant.value > element.solde) {
                        montant.style.color = 'red';
                    }
                    else {
                        montant.style.color = 'green';
                    }
                });
                historique.addEventListener('click', () => {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                    }
                    else {
                        modal.style.display = 'block';
                        // console.log(element.transactions);
                        const trans = element.transactions;
                        trans.forEach(element => {
                            const li = document.createElement('li');
                            li.classList.add('list-group-item', 'bg-primary');
                            li.innerHTML = `type Transfert :${element.typeTrans} <br>
                            montant: ${element.montant}<br>
                            Destinataire: ${element.telDestinataire}`;
                            ul.appendChild(li);
                        });
                    }
                });
                // fetch post
                valider.addEventListener('click', () => {
                    let data = {
                        "typeTrans": SelectTransaction.value,
                        "telDestinataire": element.téléphone,
                        "montant": +montant.value,
                        "compte_id": element.id
                    };
                    fetch('http://127.0.0.1:8000/api/transaction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                        .then(response => response.text())
                        .then(data => {
                        console.log(data);
                    });
                });
                console.log(element.transactions);
            }
        });
    });
});
//***************faire disparaitre la patie destinataire si c'est retrait******************** 
SelectTransaction.addEventListener('change', () => {
    if (SelectTransaction.value == "retrait") {
        destinataire.style.display = 'none';
        // let btn=document.createElement('div');
        // btn.classList.add('col-12')
        valider.innerHTML = `<button type="button" class="btn btn-primary">Valider</button>`;
        // valider.appendChild(btn)
    }
    else {
        destinataire.style.display = 'flex';
    }
});
