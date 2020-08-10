import config from "../config"

const GET = async (requestUrl, params = {}, authorization = null) => {
    let header = new Headers();
    if (authorization) {
        header.set('Authorization', authorization)
    }
    let url = new URL(`${config.APIUrl}/${requestUrl}`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    try {
        let request = await fetch(url.toString(), {
            method: "GET",
            mode: 'cors',
            headers: header,
        })
        return await request.json()
    } catch (e) {
        return {error: e}
    }
}


const POST = async (requestUrl, params, authorization = null, body=null) => {
    let header = new Headers();
    if (authorization) {
        header.set('Authorization', authorization)
    }
    let url = new URL(`${config.APIUrl}/${requestUrl}`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    try {
        let request = await fetch(url.toString(), {
            method: "POST",
            mode: 'cors',
            headers: header,
            body:body
        })
        return await request.json()
    } catch (e) {
        return {error: e}
    }
}

const DELETE = async (requestUrl, params, authorization = null) => {
    let header = new Headers();
    if (authorization) {
        header.set('Authorization', authorization)
    }
    let url = new URL(`${config.APIUrl}/${requestUrl}`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    try {
        let request = await fetch(url.toString(), {
            method: "DELETE",
            mode: 'cors',
            headers: header,
        })
        return await request.json()
    } catch (e) {
        return {error: e}

    }
}

const PUT = async (requestUrl, params, authorization = null, body=null) => {
    let header = new Headers();
    if (authorization) {
        header.set('Authorization', authorization)
    }
    let url = new URL(`${config.APIUrl}/${requestUrl}`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    try {
        let request = await fetch(url.toString(), {
            method: "PUT",
            mode: 'cors',
            headers: header,
            body:body
        })
        return await request.json()
    } catch (e) {
        return {error: e}

    }
}


export {GET, POST, PUT, DELETE}