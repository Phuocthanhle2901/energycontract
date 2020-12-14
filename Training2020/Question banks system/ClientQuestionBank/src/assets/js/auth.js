import cookie from "js-cookie";

//set cookies
export const setCookies=(key,val)=>{
    if(window!=='undefiend')
    {
        cookie.set(key,val,{expires: 1})
    }
}
//remove cookied
export const removeCookie=(key)=>{
    if(window!=='undefiend')
    {
        cookie.remove(key,{expires: 1})
    }
}
// get cookie from token
export const getCookie=(key)=>{
    if(window!=='undefiend')
    {
        return cookie.get(key);
    }
}
//set localstro
export const setLocalStorage=(key,val)=>{
    if(window!=='undefiend')
    {
        localStorage.setItem(key,JSON.stringify(val))
    }
}
//delete localStorage
export const deleteStorage=(key,val)=>{
    if(window!=='undefiend')
    {
        localStorage.removeItem(key);
    }
}
//auth after login
export const authenticate=(res)=>{
  console.log(res);
    setCookies("token",res.id)
    // setLocalStorage("user",res.email)
}
// login
export const signout=()=>{
    removeCookie('token');
}
// get info from localstorage
export const isAuth=()=>{
    if(window!=='undefiend')
    {
        const cookieCheck=getCookie("token")
        if(cookieCheck)// if token exit
        {
            return JSON.parse(getCookie("token"))

        }
        return false
    }
}

export const updateUser=(res,next)=>{
    if(window!=="undefiend")
    {
        let auth=JSON.parse(localStorage.get('user'));
        auth=res.data
        localStorage.set('user',JSON.stringify(auth));
    }
    next();
}

