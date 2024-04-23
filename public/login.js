const loginForm= document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errordiv= document.querySelector('#errordiv')
const p=document.querySelector('#p')
const passwordbtn= document.querySelector('#pswbtn');

loginForm.addEventListener('submit',submitform)

async function submitform(e)
{
    e.preventDefault();

    const userDetails={
        email:emailInput.value,
        password:passwordInput.value
    }
    try{
      
        const response =await axios.post('/userloginCheck',userDetails);
        console.log('successfully logged in');
        if(response.data.success==true)
        {
            alert(response.data.message)
            localStorage.setItem('token',response.data.token);
            localStorage.removeItem('pageSize')
            localStorage.removeItem('page')
            window.location.href='/home'
        
        }
        else{
            clearInputs()
            p.innerHTML=`${response.data.message}`;
           
            console.log(response.data.message)

        }
    
    }
    catch(err){   
        p.innerHTML=`${err}`;
        errordiv.style.display='block';
        console.log(err)
        
    }
}

function clearInputs() {
    emailInput.value = '';
    passwordInput.value = '';
  }

  passwordbtn.addEventListener('click',()=>{
    window.location.href='/forgotpassword';
  })