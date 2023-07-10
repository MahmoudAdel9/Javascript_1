//get elements
let sName = document.getElementById("name");
let phone = document.getElementById("phone");
let email = document.getElementById("email");
let score = document.getElementById("score");
let grade = document.getElementById("grade");
let addBtn = document.getElementById("add");
let searchBtn = document.getElementById("search");
let sort = document.getElementById("sort");
let tbody = document.getElementById("tbody");
let updateBtn = document.getElementById("update");
let clearBtn = document.getElementById("clear");

// calc the grade
let mood = "add";
let temp;
score.onkeyup = function () {
  if (score.value == "") {
    grade.innerHTML = "Student Grade";
  } else {
    if (score.value < 50) {
      grade.innerHTML = "Fail";
      grade.style.backgroundColor = "rgb(175, 36, 36)";
    } else if (score.value < 70) {
      grade.innerHTML = "Fair";
      grade.style.backgroundColor = "orange";
    } else if (score.value < 80) {
      grade.innerHTML = "Good";
      grade.style.backgroundColor = "#fdbe49";
    } else if (score.value < 90) {
      grade.innerHTML = "Very Good";
      grade.style.backgroundColor = "#28c728";
    } else if (score.value <= 100) {
      grade.innerHTML = "Excellent";
      grade.style.backgroundColor = "green";
    } else {
      grade.innerHTML = "Invalid Score";
      grade.style.backgroundColor = "red";
    }
  }
};

//add student
let allStudents;
if (localStorage.getItem("student") != null) {
  allStudents = JSON.parse(localStorage.getItem("student"));
} else {
  allStudents = [];
}

addBtn.onclick = function () {
  student = {
    name: sName.value.toLowerCase(),
    phone: phone.value,
    email: email.value,
    score: score.value,
    grade: grade.innerHTML.toLowerCase(),
  };
  if (
    sName.value != "" &&
    phone.value != "" &&
    email.value != "" &&
    score.value != "" &&
    score.value <= 100
  ) {
    if (mood === "add") {
      allStudents.push(student);
    } else {
      allStudents[temp] = student;
      mood = "add";
      add.innerHTML = "Add Student";
      add.style.backgroundColor = "rgb(58, 127, 255)";
    }
    clearInputs();
  }
  //save in localstorage
  localStorage.setItem("student", JSON.stringify(allStudents));
  show();
  updateConuts();
};

//clear inputs
function clearInputs() {
  sName.value = "";
  phone.value = "";
  email.value = "";
  score.value = "";
  grade.innerHTML = "Student Grade";
  grade.style.backgroundColor = "blue";
}

//read
function show() {
  let row = "";
  for (let i = 0; i < allStudents.length; i++) {
    row += ` 
    <tr>
    <td>${i + 1}</td>
    <td>${allStudents[i].name}</td>
    <td>${allStudents[i].phone}</td>
    <td>${allStudents[i].score}</td>
    <td>${allStudents[i].grade}</td>
    <td><button onclick="updateStudent(${i})" id="update">Update</button></td>
    <td><button onclick="deleteStudent(${i})" id="delete">Delete</button></td>
  </tr>`;
  }
  document.getElementById("tbody").innerHTML = row;
  updateConuts();
}

//sort
sort.onclick = function () {
  allStudents.sort(function (a, b) {
    return b.score - a.score;
  });
  show();
};

//update
function updateStudent(index) {
  sName.value = allStudents[index].name;
  phone.value = allStudents[index].phone;
  email.value = allStudents[index].email;
  score.value = allStudents[index].score;
  grade.innerHTML = allStudents[index].grade;
  temp = index;
  mood = "update";
  add.innerHTML = "update Student";
  add.style.backgroundColor = "green";
  scroll({
    top: 40,
    behavior: "smooth",
  });
}

//delete
function deleteStudent(index) {
  console.log(allStudents);
  allStudents.splice(index, 1);
  localStorage.setItem("student", JSON.stringify(allStudents));
  show();
  updateConuts();
}

//serch
let searchMood;
function getSearchMood(id) {
  scroll({
    behavior: "smooth",
  });
  searchBtn.style.display = "block";
  searchBtn.focus();
  if (id === "byName") {
    searchBtn.placeholder = " Search By Name ";
    searchMood = "Name";
  } else if (id === "byGr") {
    searchBtn.placeholder = " Search By Grade ";
    searchMood = "Grade";
  }
  searchBtn.value = "";
  show();
}

function searchStudent(value) {
  let row = "";
  if (searchMood === "Name") {
    for (let i = 0; i < allStudents.length; i++) {
      if (allStudents[i].name.startsWith(value.toLowerCase())) {
        row += ` 
          <tr>
          <td>${i + 1}</td>
          <td>${allStudents[i].name}</td>
          <td>${allStudents[i].phone}</td>
          <td>${allStudents[i].score}</td>
          <td>${allStudents[i].grade}</td>
          <td><button onclick="updateStudent(${i})" id="update">Update</button></td>
          <td><button onclick="deleteStudent(${i})" id="delete">Delete</button></td>
        </tr>`;
      }
    }
  } else {
    for (let i = 0; i < allStudents.length; i++) {
      if (allStudents[i].grade.startsWith(value.toLowerCase())) {
        row += ` 
        <tr>
        <td>${i + 1}</td>
        <td>${allStudents[i].name}</td>
        <td>${allStudents[i].phone}</td>
        <td>${allStudents[i].score}</td>
        <td>${allStudents[i].grade}</td>
        <td><button onclick="updateStudent(${i})" id="update">Update</button></td>
        <td><button onclick="deleteStudent(${i})" id="delete">Delete</button></td>
      </tr>`;
      }
    }
  }

  document.getElementById("tbody").innerHTML = row;
  updateConuts();
}

// updateConuts
function updateConuts() {
  clearBtn.innerHTML = `Delete All Students (${allStudents.length})`;
}

//clear all
function clearAll() {
  allStudents = [];
  localStorage.clear();
  show();
}

//import students
function importStudents() {
  fetch("students.json")
    .then((result) => {
      let myData = result.json();
      return myData;
    })
    .then((all) => {
      // Define a function to assign grades based on score
      function assignGrade(score) {
        if (score > 100) {
          return "Invalid Score";
        } else {
          if (score >= 90) {
            return "Excellent";
          } else if (score >= 80) {
            return "Very Good";
          } else if (score >= 70) {
            return "Good";
          } else if (score >= 50) {
            return "Fair";
          } else {
            return "Fail";
          }
        }
      }
      for (let i = 0; i < all.length; i++) {
        all[i].grade = assignGrade(all[i].score);
        all[i].name = all[i].name.toLowerCase();
        all[i].grade = all[i].grade.toLowerCase();
        allStudents.push(all[i]);
        localStorage.setItem("student", JSON.stringify(allStudents));
        show();
      }
    });
}

show();
