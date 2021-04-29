import axios from 'axios';
import Qs from 'qs'

export function $get(url) {

    return axios({
        url,
        dataType:"json",
        method:"get",
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
    })
}

export function $post(url,data={}) {

    return axios({
        url,
        data:Qs.stringify(data),
        dataType:"json",
        method:"post",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}