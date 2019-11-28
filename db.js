var admin = require("firebase-admin");

// firebase databse auth details
var serviceAccount = require("./dbConfig.json");

// initialize datbase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://treasure-hunt-3c46e.firebaseio.com"
});
var db = admin.firestore();

// insert function
async function insert(para = "",io) {
    return new Promise(async (resolve, reject) => {
        var paraArray = para.split("\n");
        for (var i = 0; i < paraArray.length; i++) {
             if (paraArray[i].trim() == "") continue;
            await insertPara(paraArray[i]).then(async (docId, err) => {
                if (err) reject(err);               
                io.sockets.emit('stats', {
                    data: `para ${i} saved`,
                })
                console.log(`para ${i} saved`);
                var tempWords = paraArray[i].split(" ");
                for (var j = 0; j < tempWords.length; j++) {
                    await insertWord(tempWords[j], docId).then((docId, err) => {
                        if (err) reject(err);
                        //sending progress to frontend as it can take lot of time
                        io.sockets.emit('stats', {
                            data: `indexing word ${j} of para ${i}`,
                        })
                        console.log(`word ${j} of para ${i} saved`);

                    })
                }
                resolve("success");

            })
        }
    })

}


// function to insert single paragraph and return id of the saved paragraph
function insertPara(paragraph) {

    return new Promise((resolve, reject) => {
        db.collection("paragraphs").add({
            paragraph
        }).then(function (docRef) {
            resolve(docRef.id)

        })
            .catch(function (error) {
                reject(error);

            });
    })


}

// function to save word. If this word already exist it will add the id of the current paragraph else it will save this word
function insertWord(word = "", docId = "") {

    return new Promise((resolve, reject) => {

        word = word.trim().toLowerCase();

        db.collection("words").where("word", "==", word).limit(1).get()
            .then((documents) => {
                if (documents.docs.length == 0) {
                    console.log("adding word")
                    db.collection("words").add({
                        word,
                        documents: [docId]
                    }).then((docRef) => {
                        resolve(docRef.id)

                    }).catch((error) => {
                        reject(error)
                    })

                }
                else {
                    console.log("updating")
                    db.collection("words").doc(documents.docs[0].id).update({
                        documents: admin.firestore.FieldValue.arrayUnion(docId)
                    }).then((value) => {
                        resolve(documents.docs[0].id)
                    }).catch((error) => {
                        reject(error);
                    })

                }

            })

    })



}

// search word and return array of paragraphs documents ids--
function search(word = "") {
    return new Promise((resolve, reject) => {

        db.collection("words").where("word", "==", word).limit(1).get()
            .then((documents) => {
                if (documents.docs.length == 0) {
                     reject("word not found!");
                }
                else {
                    resolve(documents.docs[0].data()['documents'])

                }
            }).catch((error) => {
                reject(error);
            })

    })

}

// deleting all the indexing
function deleteIndexing(){
    db.collection("words").get().then((documents)=>{
        documents.docs.forEach((doc)=>{
            console.log(`deleting ${doc.id}`);
             db.collection('words').doc(doc.id).delete();
        })
       
        
    })
 

}


// function get paragraphs from document ids for a search query [only 10]
async function getParagraphs(list = []) {
    return new Promise(async (resolve, reject) => {
        var result = [];
        for (var i = 0; i < Math.min(list.length, 10); i++) {
            await db.collection("paragraphs").doc(list[i]).get().then((document) => {
                result.push(document.data());
            }).catch((error) => {
                reject(error);
            })


        }
        resolve(result);
    })
}

// exporting all the functions
module.exports = {
    insert,
    search,
    getParagraphs,
    deleteIndexing
}