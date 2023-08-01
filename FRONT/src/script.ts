let tel = document.querySelector("#inputEmail4") as HTMLInputElement;
let nomComplet = document.querySelector("#inputPassword4") as HTMLInputElement;
let montant = document.getElementById("solde") as HTMLInputElement;
const valider = document.querySelector('.btn') as HTMLButtonElement;
const SelectFournisseur = document.getElementById('selectF') as HTMLSelectElement;
const SelectTransaction = document.getElementById('selectT') as HTMLSelectElement;
let destinataire = document.querySelector(".destinataire") as HTMLDivElement
let historique = document.querySelector('#historique') as HTMLIFrameElement;
let modal = document.querySelector('#modal') as HTMLDivElement
let ul = document.querySelector(".list-group") as HTMLUListElement
modal.style.display = 'none';


//*****************notification********************* */
let showNotif = (msg: string) => {
    let notif = document.querySelector(".notif") as HTMLSelectElement;
    notif.textContent = msg
    notif.classList.add("show")
    setTimeout(() => {
        notif.classList.remove("show")
    }, 2000)
}

enum Fournisseur {
    OM,
    WV,
    WR,
    CB
}

enum Transaction {
    depot,
    retrait,
    transfert
}

type transaction = {
    typeTrans: string;
    telDestinataire: number;
    montant: number;
    compte_id: number;
}

interface MyData {
    id:number;
    solde: number;
    NumCompte: string;
    Nom: string;
    Prenom: string;
    téléphone: number
    transactions: []
}

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
        const Data: MyData[] = data.data
        console.log(Data);



        Data.forEach((element: MyData) => {

            tel.addEventListener('input', () => {

                if (+tel.value == element.téléphone || tel.value == element.NumCompte) {
                    nomComplet.value = element.Nom + " " + element.Prenom


                    montant.addEventListener('input', () => {
                        if (+montant.value > element.solde) {
                            montant.style.color = 'red'

                        } else {
                            montant.style.color = 'green'
                        }
                    })
                    historique.addEventListener('click', () => {
                        if (modal.style.display === 'block') {
                            modal.style.display = 'none';
                        } else {
                            modal.style.display = 'block';
                            // console.log(element.transactions);
                            const trans: transaction[] = element.transactions
                            trans.forEach(element => {
                                const li = document.createElement('li');
                                li.classList.add('list-group-item', 'bg-primary')
                                li.innerHTML = `type Transfert :${element.typeTrans} <br>
                            montant: ${element.montant}<br>
                            Destinataire: ${element.telDestinataire}`;
                                ul.appendChild(li);
                            });

                        }

                    });


                    // fetch post

                    valider.addEventListener('click', () => {

                        let data: transaction = {
                            "typeTrans": SelectTransaction.value,
                            "telDestinataire": element.téléphone,
                            "montant": +montant.value,
                            "compte_id": element.id
                        }

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

                            })

                    })
                    console.log(element.transactions);


                }
            })


        });

    });

//***************faire disparaitre la patie destinataire si c'est retrait******************** 
SelectTransaction.addEventListener('change', () => {
    if (SelectTransaction.value == "retrait") {
        destinataire.style.display = 'none'
        // let btn=document.createElement('div');
        // btn.classList.add('col-12')
        valider.innerHTML = `<button type="button" class="btn btn-primary">Valider</button>`
        // valider.appendChild(btn)
    } else {
        destinataire.style.display = 'flex'
    }
})




