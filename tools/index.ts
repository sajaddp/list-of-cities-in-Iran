import list from "../offical/list.json"

interface ListInterface {
    type: string,
    name: string,
    national_id: number
}

let provincesIds: { [key: string]: number } = {};
let citiesIds: { [key: string]: number } = {};
let districtIds: { [key: string]: number } = {};
let ruralIds: { [key: string]: number } = {};

let provincesOutput: { id: number, name: string, slug: string, tel_prefix: string }[] = [];

(list as ListInterface[]).forEach((item: ListInterface, index: number) => {
    // "type": "دهستان",
    // "name": "الهیجان",
    // "province": "آذربایجان شرقی",
    // "city": "تبریز",
    // "district": "خسروشاه",
    // "national_id": 1000015246
    if (item.type == "استان") {
        provincesIds[item.name] = item.national_id;
        provincesOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            tel_prefix: telPrefixorProvince(item.name)
        })
    } else if (item.type == "شهرستان") {
        citiesIds[item.name] = item.national_id;
    } else if (item.type == "بخش") {
        districtIds[item.name] = item.national_id;
    } else if (item.type == "دهستان") {
        ruralIds[item.name] = item.national_id;
    }
});


// fs.writeFile(outputFilePath, JSON.stringify(outputData, null, 2), 'utf-8', (err) => {
//     if (err) {
//         console.error('Error writing output file:', err);
//     } else {
//         console.log('Output file has been created successfully.');
//     }
// });


function generateSlug(item: string): string {
    return item.replace(/[\u200C\u200B]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w\-آ-ی\u0600-\u06FF]+/g, '');
}

function telPrefixorProvince(name: string): string {
    const list: { [key: string]: string } = {
        "آذربایجان شرقی": "041",
        "آذربایجان غربی": "044",
        "اردبیل": "045",
        "اصفهان": "031",
        "البرز": "026",
        "ایلام": "084",
        "بوشهر": "077",
        "تهران": "021",
        "چهارمحال و بختیاری": "038",
        "خراسان جنوبی": "056",
        "خراسان رضوی": "051",
        "خراسان شمالی": "058",
        "خوزستان": "061",
        "زنجان": "024",
        "سمنان": "023",
        "سیستان و بلوچستان": "054",
        "فارس": "071",
        "قزوین": "028",
        "قم": "025",
        "کردستان": "087",
        "کرمان": "034",
        "کرمانشاه": "083",
        "کهگیلویه و بویراحمد": "074",
        "گلستان": "017",
        "لرستان": "066",
        "گیلان": "013",
        "مازندران": "011",
        "مرکزی": "086",
        "هرمزگان": "076",
        "همدان": "081",
        "یزد": "035"
    };

    return list[name] || "---";
}