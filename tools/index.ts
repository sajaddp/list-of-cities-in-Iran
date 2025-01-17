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

const outputData = (list as ListInterface[])
    .map((item: ListInterface, index: number) => {
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
                tel_prefix: 
            })
        } else if (item.type == "شهرستان") {
            citiesIds[item.name] = item.national_id;
        } else if (item.type == "بخش") {
            districtIds[item.name] = item.national_id;
        } else if (item.type == "دهستان") {
            ruralIds[item.name] = item.national_id;
        }


        return {
            id: item.national_id, // شماره‌گذاری id از 1 شروع می‌شود
            name: item.name, // نام شهرستان
            slug: item.name.toLowerCase().replace(/\s+/g, '-'),
            province_id: index + 1
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

function telPrefixorProvince() {
    [
        {
            "name": "آذربایجان شرقی",
            "tel_prefix": "041"
        },
        {
            "name": "آذربایجان غربی",
            "tel_prefix": "044"
        },
        {
            "name": "اردبیل",
            "tel_prefix": "045"
        },
        {
            "name": "اصفهان",
            "tel_prefix": "031"
        },
        {
            "name": "البرز",
            "tel_prefix": "026"
        },
        {
            "name": "ایلام",
            "tel_prefix": "084"
        },
        {
            "name": "بوشهر",
            "tel_prefix": "077"
        },
        {
            "name": "تهران",
            "tel_prefix": "021"
        },
        {
            "name": "چهارمحال و بختیاری",
            "tel_prefix": "038"
        },
        {
            "name": "خراسان جنوبی",
            "tel_prefix": "056"
        },
        {
            "name": "خراسان رضوی",
            "tel_prefix": "051"
        },
        {
            "name": "خراسان شمالی",
            "tel_prefix": "058"
        },
        {
            "name": "خوزستان",
            "tel_prefix": "061"
        },
        {
            "name": "زنجان",
            "tel_prefix": "024"
        },
        {
            "name": "سمنان",
            "tel_prefix": "023"
        },
        {
            "name": "سیستان و بلوچستان",
            "tel_prefix": "054"
        },
        {
            "name": "فارس",
            "tel_prefix": "071"
        },
        {
            "name": "قزوین",
            "tel_prefix": "028"
        },
        {
            "name": "قم",
            "tel_prefix": "025"
        },
        {
            "name": "کردستان",
            "tel_prefix": "087"
        },
        {
            "name": "کرمان",
            "tel_prefix": "034"
        },
        {
            "name": "کرمانشاه",
            "tel_prefix": "083"
        },
        {
            "name": "کهگیلویه و بویراحمد",
            "tel_prefix": "074"
        },
        {
            "name": "گلستان",
            "tel_prefix": "017"
        },
        {
            "name": "لرستان",
            "tel_prefix": "066"
        },
        {
            "name": "گیلان",
            "tel_prefix": "013"
        },
        {
            "name": "مازندران",
            "tel_prefix": "011"
        },
        {
            "name": "مرکزی",
            "tel_prefix": "086"
        },
        {
            "name": "هرمزگان",
            "tel_prefix": "076"
        },
        {
            "name": "همدان",
            "tel_prefix": "081"
        },
        {
            "name": "یزد",
            "tel_prefix": "035"
        }
    ];
}
