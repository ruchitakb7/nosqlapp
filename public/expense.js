
const expenseForm= document.querySelector('#expenseForm');
const expenseAmount = document.querySelector('#expenseAmount');
const expenseDescription = document.querySelector('#expenseDescription')
const expenseCategory = document.querySelector('#expenseCategory');
const Tbody= document.querySelector('#Tbody');
const rzrpay = document.querySelector('#rzrpay');
const premium = document.querySelector('#premium');
const paybtn = document.createElement('button');
const leaderboardbtn = document.createElement('button');
const leaderboard = document.querySelector('#leaderboard');
const a= document.querySelector('#a');
const selectdiv= document.getElementById('#selctdiv')
const pagebtn= document.querySelector('#pagebtn');
const pagesizeval= document.querySelector('#pagesizeval')

let page;
let record_per_page;
pagebtn.addEventListener('click',()=>{
    record_per_page=pagesizeval.value 
    localStorage.setItem('pageSize',record_per_page);
    localStorage.setItem('page',1)
    location.href='/home'
})

function login()
{
    
    location.href='/login';
}
expenseForm.addEventListener('submit',addExpense)

window.addEventListener('DOMContentLoaded',expenseSheet);


async function addExpense(e)
{
    e.preventDefault();    
        const p={
            expenseAmount:expenseAmount.value,
            expenseDescription:expenseDescription.value,
            expenseCategory:expenseCategory.value
        }
    
        try{
           const token = localStorage.getItem('token');
           if(token){
            console.log(token)
            const response=await axios.post('/addExpense',p,{headers:{"Authorization":token}});
            console.log('Data has been added successfully')
            userprofile()
          
            location.href='/home';
           }
           else{
            console.log("Do login first")
            alert('You must be logged in to this page ')

           }
          
        }
        catch(e)
        {
            console.log(e)
            alert('you must be logged in to this page ');
        }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

async function expenseSheet(e)  //refresh
{
    e.preventDefault();
   
    try{
        const token = localStorage.getItem('token');
     //   userprofile()
        if(token){
           
            checkrecordpage()
            const res = await axios.get(`/Expensesheet?page=${page}&pageSize=${record_per_page}`,{headers:{"Authorization":token}});
            console.log(res.data.allExpenses)
            
          //  const decode= parseJwt(token)
          //  console.log(decode)
            userprofile()
            showPremiumusermessage(res.data)
            generatepage(res.data.lastPage)
            if(res.data.allExpenses.length!=0){
             //  updateUsertble()       
                printSheet(res.data)
            }
                 

        } 
        
        }
        catch(e)
         {   
            console.log(e)
         }

}
function checkrecordpage()
{
    const record=localStorage.getItem('pageSize')
    if(!record)
    {
        page=1;
        record_per_page=5;
        pagesizeval.value=record_per_page;
        localStorage.setItem('page',page)
        localStorage.setItem('pageSize',record_per_page)
    }
    else{
        record_per_page=record;
        pagesizeval.value=record;
        page=localStorage.getItem('page')
    }

}


async function printSheet(expenseData)
{
    document.getElementById('expenseTable').style.display='block';
    document.getElementById('pagerecord').style.display='block';
    const start=expenseData.start_index;

    let i=0;
    const expense= expenseData.allExpenses;
    
                           
    document.getElementById('table').value="";
    expense.forEach(p=>{

   
        const tr= document.createElement('tr');
        const td0= document.createElement('td');
        const td1= document.createElement('td');
        const td2= document.createElement('td');
        const td3= document.createElement('td');
        const td4= document.createElement('td');

        const btn= document.createElement('button');
        btn.appendChild(document.createTextNode('Delete'));
        td4.appendChild(btn);
        btn.setAttribute('class','btn btn-danger');

        td0.innerHTML=`${i+start}`
        td1.innerHTML=`${p.expenseAmount}`
        td2.innerHTML=`${p.expenseDescription}`
        td3.innerHTML=`${p.expenseCategory}`

        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4)
        Tbody.appendChild(tr);
        
        btn.addEventListener('click',()=>{deleteExpense(p)})
        i++;

    })

}


async function deleteExpense(p)
{
    console.log(p)
    try{
        const token = localStorage.getItem('token');  
        const response= await axios.delete(`/deleteexpense/${p._id}`,{headers:{"Authorization":token}})
        console.log('Data has been deleted successfully')
        location.href='/home';
        
    }
    catch(e){
        console.log(e)
    }
}

    paybtn.onclick = async function (e) {
    const token=localStorage.getItem('token');
    const response = await axios.get('/purchase/premiummembership', {headers:{"Authorization":token}});
  
    var options = 
    {
      "key":response.data.key_id,
      "order_id":response.data.order.id,
      "handler":async function(response){
          const res = await axios.post('/purchase/updatetransactionstatus', {
          order_id:options.order_id,
          payment_id:response.razorpay_payment_id
        }, {headers:{"Authorization":token}});
      
        localStorage.setItem('token',res.data.token);
        console.log('you took premium membership')
        alert('You are a premium user now');
        location.href='/home';      
      },
    };
  
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  
    rzp1.on('payment.failed', function(response){
      alert('Something went wrong');
    
    });
  }

  function userprofile()     //log out function
  {
    document.getElementById('profile').innerHTML=`
    <button id='logout' class='btn btn-primary' style="font-size: 10px">Log Out</button>`

    document.getElementById('logout').addEventListener('click',()=>{
      localStorage.removeItem('token')
      location.href='/login';
        
    })
  }

  function showPremiumusermessage(expenseinfo)
{
    if(expenseinfo.check==true){

        premium.innerHTML+="You are now a Premium User !    "
        leaderboardbtn.appendChild(document.createTextNode('Show LeaderBoard'))
        premium.appendChild(leaderboardbtn);
        leaderboardbtn.setAttribute('class','btn btn-success')
        leaderboardbtn.style.marginRight='30px'
        leaderboardbtn.addEventListener('click',()=>{ getdataforleaderboard()})

        if(expenseinfo.allExpenses.length!=0){

            const downloadbtn= document.createElement('button');
            downloadbtn.appendChild(document.createTextNode('Download Report'))
            premium.appendChild(downloadbtn);
            downloadbtn.setAttribute('class','btn btn-success')
            downloadbtn.addEventListener('click',()=>{downloadreport()})

        }
        


    }
    else{
        paybtn.appendChild(document.createTextNode('Buy Premium Membership'))
        premium.appendChild(paybtn);
        paybtn.setAttribute('class','btn btn-success');

    }
   
}

// async function updateUsertble()
// {
//     try{
//         const token=localStorage.getItem('token');
//         const userexpesnes= await axios.get('/updateTotalExpense',{headers:{"Authorization":token}});   
//         console.log('Data has updated')    
//     }
//     catch(e){console.log(e)}
// }

async function getdataforleaderboard(){
try{
       const userData= await axios.get('/getdataforleaderboard')
       console.log(userData.data)
       showLeaderboard(userData.data)

   }
   catch(e){
   console.log(e)
   }
}

function showLeaderboard(userData)
{
    leaderboard.style.display='block'
    const tbody= document.getElementById('tbody')
  //  console.log(userData);
    userData.forEach(user=>{
        const tr=document.createElement('tr');
        const td1= document.createElement('td');
        const td2 = document.createElement('td');
        td1.innerHTML=`${user.name}`;
        td2.innerHTML=`${user.totalExpenses}`;

        tr.appendChild(td1)
        tr.appendChild(td2)
        tbody.appendChild(tr);

    }) 
    
}

async function downloadreport()
{
    
        const token= localStorage.getItem('token');
        await axios.get('/user/download',{headers:{"Authorization":token}})
        .then((response)=>{
            if(response.status === 200){
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myExpense.txt';
                a.click();
            } 
            else {
                throw new Error(response.data.message)
            }

        }) 
        .catch((err) => {
            console.log(err)
        });

}
  
  function generatepage(pagenumber)
  {
    
    let prvbtn=`<li class="page-item" >
    <a class="page-link" id="prvpage" onclick="prvpage()" href="javascript:void(0)">Previous</a>
    </li>`;

    let nextbtn=`<li class="page-item ">
    <a class="page-link" id="nextpage" onclick="nextpage(${pagenumber})" href="javascript:void(0)">Next</a> 
    </li>`;
   
   if(page>pagenumber)
   {
     prvpage()
   }

   let buttons='';
   let activeclass='active';
    for(let i=1;i<=pagenumber;i++)
    {
       if(page==i)
       {
        activeclass='active'
       }
       else{
        activeclass='';
       }
      buttons += `<li class="page-item ${activeclass} "><a class="page-link" onclick="currentpage(${i})" id="page${i}" href="javascript:void(0)">${i}</a> </li>`
    
    }
    document.getElementById('pagination').innerHTML=`${prvbtn}${buttons}${nextbtn}`; 
  }

  function prvpage(){
    if (page!=1)
    {
        page-- ;
        localStorage.setItem('page',page)
        location.href='/home'
    }
  
  }

  function nextpage(last)
  {  if(page<last)
    {    
    page++ ;
    localStorage.setItem('page',page)
    location.href='/home'
    }
  }

  function currentpage(i)
  {
    page=i
    localStorage.setItem('page',i)
    location.href='/home';
  }

