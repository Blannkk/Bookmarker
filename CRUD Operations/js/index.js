var siteNameInput = document.getElementById("siteName");
var siteUrlInput = document.getElementById("siteUrl");
var localStorageData = 'data';
var siteInfo = JSON.parse(localStorage.getItem(localStorageData)) || [];
if (JSON.parse(localStorage.getItem(localStorageData))) {
    displaySite();
}
var newSite = document.getElementById("addSite");

newSite.addEventListener('click', getUserInput);

function getUserInput() {
    var siteValues = {
        name: siteNameInput.value,
        url: siteUrlInput.value
    }
    siteInfo.push(siteValues);
    localStorage.setItem(localStorageData, JSON.stringify(siteInfo));
    displaySite();
    clearInput();
    removeValidation();
    newSite.setAttribute('disabled', 'disabled');
}


function clearInput() {
    siteNameInput.value = '';
    siteUrlInput.value = '';
}


function displaySite() {
    var Bbox = "";
    for (var i = 0; i < siteInfo.length; i++) {
        Bbox += ` 
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${siteInfo[i].name}</td>
            <td><button class="btn btn-visit"><a class="text-decoration-none text-white" href="${siteInfo[i].url}" target="_blank"><i class="fa-regular fa-eye"></i> visit</a></button></td>
            <td><button onclick="editSite(${i})" class="edit-site btn btn-warning px-4"><i class="fa-solid fa-edit"></i> Edit</button></td>
            <td><button id="deleteBtn" onclick="confirmDelete(${i})" class="delete-site btn btn-danger px-4" data-target="delete" data-index="${i}"><i class="fa-solid fa-trash"></i> Delete</button></td>
        </tr>
        `;
    }
    document.getElementById("sitePlace").innerHTML = Bbox;
    attachDeleteEventListeners();
}


function deleteSite(index) {
    siteInfo.splice(index, 1);
    localStorage.setItem(localStorageData, JSON.stringify(siteInfo));
    displaySite();
}

function editSite(index) {
    const site = siteInfo[index];
    siteNameInput.value = site.name;
    siteUrlInput.value = site.url;
    newSite.removeEventListener('click', getUserInput);
    newSite.addEventListener('click', function updateSite() {
        siteInfo[index] = {
            name: siteNameInput.value,
            url: siteUrlInput.value
        };
        localStorage.setItem(localStorageData, JSON.stringify(siteInfo));
        displaySite();
        clearInput();
        removeValidation();
        newSite.setAttribute('disabled', 'disabled');
        newSite.removeEventListener('click', updateSite);
        newSite.addEventListener('click', getUserInput);
        showAlertUpdate('Site updated successfully!');
    });
}

function attachDeleteEventListeners() {
    var deleteBtns = Array.from(document.querySelectorAll(".delete-site"));
    deleteBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => confirmDelete(index));
    });
}

var inputs = Array.from(document.querySelectorAll('.form-control'));

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('input', function () {
        validateInputsValue(this)
    })
}

function validateInputsValue(elem) {
    var regex = {
        siteName: /^[A-Za-z\u0600-\u06FF\s]{4,50}$/,
        siteUrl: /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/
    }
    if (regex[elem.id].test(elem.value)) {

        elem.classList.add('is-valid');
        elem.classList.remove('is-invalid');
        return true;
    } else {
        elem.classList.remove('is-valid');
        elem.classList.add('is-invalid');
        return false;
    }
}

function removeValidation() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('is-valid');
    }
}
siteNameInput.addEventListener('input', validateInputFields);
siteUrlInput.addEventListener('input', validateInputFields);

function validateInputFields() {
    if (validateInputsValue(siteNameInput) && validateInputsValue(siteUrlInput)) {
        newSite.removeAttribute('disabled');
    } else {
        newSite.setAttribute('disabled', 'disabled');
    }
}

newSite.addEventListener('click', showAlertAdd);

function showAlertAdd() {
    Swal.fire({
        title: 'Site Added Successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
    });
}
function showAlertUpdate() {
    Swal.fire({
        title: 'Site Updated Successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
    });
}


function confirmDelete(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'danger',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteSite(index);
            Swal.fire(
                'Deleted!',
                'Your bookmark has been deleted.',
                'success'
            );
        }
    });
}