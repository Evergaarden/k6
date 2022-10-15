import { sleep, check } from 'k6'
import http from 'k6/http'
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js'
// импорт методов для парсинга тела ответа

export const optionsSertificate = {
    insecureSkipTLSVerify: true,
};
// для обхода сертификата

// export const options = {
//     startVUs: 1,
//     stages : [
//           {duration: "60s", target: 10},
//           {duration: "180s", target: 10},
//           {duration: "120s", target: 20},
//           {duration: "10s", target: 0},
//         ]};

export default function () {
    const generalUrl = 'https://petstore.swagger.io/'
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }}
    const paramsNew = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }}

    let payloadPostPet = JSON.stringify(
        {
        "id": 3245,
        "category": {
            "id": 2,
            "name": "test"
        },
        "name": "Pika-Pika",
        "photoUrls": [
            "string"
        ],
        "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
        "status": "available"
    })
    const reqPostPet = http.post(generalUrl + 'v2/pet', payloadPostPet, params)
    check(reqPostPet, {"POST method status 200 OK": (r) => r.status === 200})

    // const randomId = function getRandomInt(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    const reqGetPet = http.get(generalUrl + 'v2/pet/3245')

    check(reqGetPet, {
        "GET method status 200 OK": (r) => r.status === 200
        // "GET method status 404 Not Found": (r) => r.status === 404
    })

    check(reqGetPet, {
        "GET method check name is Pika-Pika": (r) => r.body.includes('Pika-Pika')})
    // проверка на совпадение имени в ответе

    let payloadPutPet = JSON.stringify({
        "id": 3245,
            "category": {
            "id": 2,
                "name": "test"
        },
        "name": "Pika-Pika",
            "photoUrls": [
            "string"
        ],
            "tags": [
            {
                "id": 0,
                "name": "string"
            }
        ],
            "status": "pending"
    })
    const reqPutPet = http.put(generalUrl + 'v2/pet', payloadPutPet, params)

    check(reqPutPet, {
        'PUT method status eql pending': response =>
            jsonpath.query(response.json(), '$.status').some(value => value === 'pending'),
    })
    check(reqPutPet, {
        "PUT method status 200 OK": (r) => r.status === 200})

    let payloadUrl = JSON.stringify('name=Pika&status=sold')

    const reqUpdatePet = http.post(generalUrl + 'v2/pet/3245', paramsNew, payloadUrl)
    check(reqUpdatePet, {
        "PUT method status 200 OK": (r) => r.status === 200
    })

    const reqDeletePet = http.del(generalUrl + 'v2/pet/3245', params)
    check(reqDeletePet, {
        "DELETE method status 200 OK": (r) => r.status === 200
    })
}