const cl = console.log;

const titleControl = document.getElementById("title")
const bodyControl = document.getElementById("body")
const userIdControl = document.getElementById("userId")
const updateBtn = document.getElementById("updateBtn")
const submitBtn = document.getElementById("submitBtn")
const postForm = document.getElementById("postForm")
const cardContainer = document.getElementById("cardContainer")


let baseUrl = `https://promise-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/`


let postUrl = `${baseUrl}/posts.json`



let obtToArr = (obj) => {
   let resultArr = []
   for (const key in obj) {
      let object = obj[key]
      object.id = key;
      resultArr.push(object)
   }
   return resultArr
}

const makeApiCall = async (apiUrl, methodName, bodyMsg = null) => {
   let res = await fetch(apiUrl, {
      method: methodName,
      body: bodyMsg,
      headers: {
         "content-type": "application/json"
      }
   })
   // cl(res)
   return await res.json()
}

const getAllCard = async () => {
   try {
      let data = await makeApiCall(postUrl, "GET")
      // cl(data)
      let postArr = obtToArr(data)
      cl(postArr)
      templatingOfPosts(postArr)
   } catch (err) {
      cl(err)
   }
}
getAllCard()

const onAddNewPost = async (eve) => {
   eve.preventDefault()
   let newObj = {
      title: titleControl.value,
      body: bodyControl.value,
      userId: userIdControl.value
   }
   //  cl(newObj)

   try {
      let res = await makeApiCall(postUrl, "POST", JSON.stringify(newObj))
      // cl(res)
      newObj.id = res.name;
      postobjtemplating(newObj)
      // Swal.fire({
      //    position: "top-center",
      //    icon: "success",
      //    title: "New Card Created Successfully!!!",
      //    showConfirmButton: false,
      //   });
   } catch (err) {
      cl(err)
   } finally {
      postForm.reset()
   }
}

const onEdit = async (ele) => {
   // cl(ele)
   let editId = ele.closest(".card").id;
   cl(editId)
   let editUrl = `${baseUrl}/posts/${editId}.json`
   // cl(editUrl)
   localStorage.setItem("editId", editId)
   try {
      let res = await makeApiCall(editUrl, "GET")
      // cl(res)
      titleControl.value = res.title;
      bodyControl.value = res.body;
      userIdControl.value = res.userId;

      scrollToTop()
   } catch (err) {
      cl(err)
   } finally {
      updateBtn.classList.remove("d-none")
      submitBtn.classList.add("d-none")
   }
}

const onUpdatePost = async (eve) => {
   let updateId = localStorage.getItem("editId")
   //   cl(updateId)
   let updateUrl = `${baseUrl}/posts/${updateId}.json`
   //   cl(updateUrl)
   let updateObj = {
      title: titleControl.value,
      body: bodyControl.value,
      userId: userIdControl.value
   }
   //   cl(updateObj)
   try {
      let res = await makeApiCall(updateUrl, "PATCH", JSON.stringify(updateObj))
      cl(res)
      let newChildren = [...document.getElementById(updateId).children]
      newChildren[0].innerHTML = `<h2>${res.title}</h2>`
      newChildren[1].innerHTML = `<p>${res.body}</p>`
      cl(newChildren)
   } catch (err) {
      cl(err)
   } finally {
      updateBtn.classList.add("d-none")
      submitBtn.classList.remove("d-none")
      postForm.reset()
   }
}

const onDelete = async (ele) => {
   let deleteId = ele.closest(".card").id;
   //  cl(deleteId)
   let deleteUrl = `${baseUrl}/posts/${deleteId}.json`
   //  cl(deleteUrl)
   try {
      let res = await makeApiCall(deleteUrl, "DELETE")
      document.getElementById(deleteId).remove()
   } catch (err) {
      cl(err)
   }
}

let postobjtemplating = eve => {
   let card = document.createElement('div');
   card.className = 'card mb-4 background';
   card.id = eve.id
   card.innerHTML = `
                       <div class="card-header">
                           <h2>${eve.title}</h2>
                       </div>
                       <div class="card-body overflow-auto">
                           <p>${eve.body}</p>
                       </div>
                       <div class="card-footer d-flex justify-content-between">
                           <button class="btn btn-outline-success" onclick="onEdit(this)"><strong>Edit</strong></button>
                           <button class="btn btn-outline-danger" onclick="onDelete(this)"><strong>Delete</strong></button>
                       </div>
                   </div>
               `
   cardContainer.append(card);
}

const templatingOfPosts = (arr) => {
   arr.forEach(posts => {
      postobjtemplating(posts)
   });
}


function scrollToTop() {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
}


updateBtn.addEventListener("click", onUpdatePost)
postForm.addEventListener("submit", onAddNewPost)






























