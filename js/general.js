let mainTab = document.querySelector('.main-tab')

// let timeString
// function updateClock() {
//     let now = new Date();
//     let hours = String(now.getHours()).padStart(2, '0');
//     let minutes = String(now.getMinutes()).padStart(2, '0');
//     let seconds = String(now.getSeconds()).padStart(2, '0');
//     timeString = `${hours}:${minutes}:${seconds}`;

// }

// setInterval(updateClock, 60000); // обновлять каждую секунду
// updateClock();

/////////////////////// хранилище ///////////////////////
let generalMasiv = []
let masivfilter = []
let filterReadyReady = []
let masiv = []
let masivOff = []
let filters = []
let company = []
let companyFilter = []
let companyTrue = []

/////////////////////// ---------- ///////////////////////

/////////////////////// обновления часов ///////////////////////
function hasTimePassed(tillTimes) {
    const [targetHours, targetMinutes] = tillTimes.split(':').map(Number);

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Сравниваем часы
    if (currentHours > targetHours) return true;
    if (currentHours < targetHours) return false;

    // Если часы равны — сравниваем минуты
    return currentMinutes >= targetMinutes;
}
function updateTillTime() {
    let tillInputs = document.querySelectorAll('.till-time input')
    masiv.forEach((input, index) => {
        if (input.tillTime) {
            if (hasTimePassed(input.tillTime)) {
                tillInputs[index].style.backgroundColor = 'rgb(172, 0, 0, 0.4)'
            } else {
            }
        }
    });
}

setInterval(updateTillTime, 10000); // обновлять каждую секунду
/////////////////////// ---------- ///////////////////////


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/////////////////////// Конфигурация Firebase ///////////////////////
const firebaseConfig = {
    apiKey: "AIzaSyBZNS6meqgFrhKhXBZc3spCMHK9hGvSuZ0",
    authDomain: "tokssaupdate.firebaseapp.com",
    projectId: "tokssaupdate",
    storageBucket: "tokssaupdate.firebasestorage.app",
    messagingSenderId: "37522886443",
    appId: "1:37522886443:web:ffe41cf86d55f902453f6e",
    measurementId: "G-29QKNF40NH"
};
/////////////////////// ---------- ///////////////////////

/////////////////////// Инициализация Firebase ///////////////////////
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
/////////////////////// ---------- ///////////////////////

/////////////////////// Создания новой компании ///////////////////////
async function saveDataCompany(name) {
    const userCompany = {
        name: name,
    };
    try {
        const docRefC = doc(collection(db, "company"));
        await setDoc(docRefC, userCompany);
    } catch (e) {
        console.error("Ошибка при сохранении данных:", e);
    }
    listenToDataCompany()
    saveCompanyTrue()
}
/////////////////////// ---------- ///////////////////////

/////////////////////// Сохранение в Логальную базу масив Компании ///////////////////////
function saveCompanyTrue() {
    localStorage.setItem("CompanyTrue", JSON.stringify(companyTrue));
}
/////////////////////// ---------- ///////////////////////

/////////////////////// Обнаруживает изменения в базе ///////////////////////
function filterCompanyTrue() {
    if (companyFilter.length === companyTrue.length) {
        companyFilter = companyTrue
    } else {
        companyTrue.forEach(element => {
            companyFilter.forEach(input => {
                if (element.name === input.name) {
                    input.t = element.t
                }
            });
        });
        localStorage.setItem("CompanyTrue", JSON.stringify(companyFilter));
    }
}
/////////////////////// ---------- ///////////////////////

/////////////////////// Получение всех компаний ///////////////////////
function listenToDataCompany() {
    const q = collection(db, "company");
    onSnapshot(q, (snapshot) => {
        companyFilter = []
        company = []
        snapshot.forEach((doc) => {
            let data = doc.data(); // получаем данные  
            companyFilter.push({
                name: data.name,
                idPass: doc.id,
                t: false,
            },)
        });
        const dataCompanyTrue = localStorage.getItem('CompanyTrue')
        if (JSON.parse(dataCompanyTrue)) {
            companyTrue = JSON.parse(dataCompanyTrue)

            filterCompanyTrue()
        } else {
            saveCompanyTrue()
        }
        CompanyMenuCreat()  // вызываем перерисовку сайта
        startFilterC()
    });
}
/////////////////////// ---------------- ///////////////////////

/////////////////////// Удаления компаний а также драйверов ///////////////////////
async function deleteDataCompany(documentId, nameCompany) {
    for (const element of generalMasiv) {
        if (element.company == nameCompany) {
            try {
                await deleteDoc(doc(db, "masiv", element.idPass));
                listenToData();
                start();
            } catch (e) {
                console.error("Ошибка при удалении документа:", e);
            }
        }
    }
    try {
        await deleteDoc(doc(db, "company", documentId));

        localStorage.removeItem('CompanyTrue');
        listenToDataCompany(); // чтобы обновить список после удаления
        CompanyMenuCreat()
    } catch (e) {
        console.error("Ошибка при удалении документа:", e);
    }
}

/////////////////////// ---------- ///////////////////////

let mainCenterCenter = document.querySelector('.main-center-center')
listenToDataCompany();

/////////////////////// получаем доступ и дайом логику кнопкам компании ///////////////////////
function CompanyMenuCreat() {
    mainCenterCenter.innerHTML = ''
    company.forEach((element, index) => { // создаем сами кнопки для компании
        let butMainCanter = document.createElement('div')
        let butMainCanterH1 = document.createElement('h1')
        let butMainCenterBottom = document.createElement('div')

        butMainCanterH1.innerHTML = element.name;

        if (element.t) {
            butMainCanter.classList.add('but-main-center-ready')
        } else {

        }

        butMainCanter.classList.add('but-main-canter')
        butMainCenterBottom.classList.add('but-main-center-bottom')

        mainCenterCenter.append(butMainCanter)
        butMainCanter.append(butMainCanterH1, butMainCenterBottom)
        // Search Local //
        butMainCanter.setAttribute("draggable", true);
        butMainCanter.dataset.index = index;
        // Слушатели событий перетаскивания
        butMainCanter.addEventListener("dragstart", dragStartC);
        butMainCanter.addEventListener("dragover", dragOverC);
        butMainCanter.addEventListener("drop", dropC);
        butMainCanter.addEventListener("dragend", dragEndC);
        butMainCanter.addEventListener("dragenter", dragEnterC);
        butMainCanter.addEventListener("dragleave", dragLeaveC);
        changeColorStatus(parseFloat(slider.value))
        // swap ----------- //
    });
    let butMainCanterBut = document.querySelectorAll('.but-main-canter')
    let butMainCanterButH1 = document.querySelectorAll('.but-main-canter h1')

    function updateCompanyTrue() { // очищает кнопки от взаимодействия
        butMainCanterBut.forEach(element => {
            element.classList.remove('but-main-center-ready')
        });
    }

    function updateCompanyTrueMasiv() { // очищает масив кнопки от взаимодействия 
        companyTrue.forEach(element => {
            element.t = false
        });
    }

    butMainCanterBut.forEach((element, index) => { // наблюдает за кликами и их дальнешее напровления 
        element.onclick = (() => {
            updateCompanyTrue()
            element.classList.add('but-main-center-ready')
            companyTrue.forEach((elementIn, indexIn) => {
                if (butMainCanterButH1[index].innerHTML === elementIn.name) {
                    updateCompanyTrueMasiv()
                    elementIn.t = true
                    saveCompanyTrue()
                }
            });
            listenToData()
        })
    });
    console.log(companyFilter);
}


let tabs2 = document.querySelectorAll('.but-main-canter')

// Событие начала перетаскивания
function dragStartC(e) {
    draggedEl = e.target;
    draggedIndex = +e.target.dataset.index;
    e.target.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ""); // нужно для Firefox
    document.body.classList.add("drag-cursor-grabbing");
}

// При наведении на другой блок
function dragEnterC(e) {
    e.preventDefault();
    const enterTarget = e.target.closest(".but-main-canter");
    if (!enterTarget || enterTarget === draggedEl) return;
    enterTarget.classList.add("placeholder");
    document.body.classList.remove("drag-cursor-grabbing");
    document.body.classList.add("drag-cursor-grab");
}
// Убираем подсветку
function dragLeaveC(e) {
    e.preventDefault();
    const enterTarget = e.target.closest(".but-main-canter");
    if (!enterTarget || enterTarget === draggedEl) return;
    e.target.classList.remove("placeholder");
    document.body.classList.remove("drag-cursor-grab");
    document.body.classList.add("drag-cursor-grabbing");
}
// Разрешаем дроп
function dragOverC(e) {
    e.preventDefault();
}
// Когда отпускаем блок
function dropC(e) {
    e.preventDefault();
    const dropTarget = e.target.closest(".but-main-canter");
    if (!dropTarget || dropTarget === draggedEl) return;
    dropTarget.classList.remove("placeholder");
    const targetIndex = +dropTarget.dataset.index;
    if (targetIndex === draggedIndex) return;
    const draggedItem = company[draggedIndex];
    company.splice(draggedIndex, 1);
    company.splice(targetIndex, 0, draggedItem);
    saveToLocalStorageC()
    CompanyMenuCreat();
}
// Конец перетаскивания
function dragEndC(e) {
    e.target.classList.remove("dragging");
    document.body.classList.remove("drag-cursor-grabbing");
    document.body.classList.remove("drag-cursor-grab");
}
// Swap ----------- //
function loadFromLocalStorageC() {
    const data = localStorage.getItem("tabsOrder2");
    if (data) {
        filters = JSON.parse(data);
        company.sort((a, b) => {
            const indexA = filters.findIndex(f => f.idPass === a.idPass);
            const indexB = filters.findIndex(f => f.idPass === b.idPass);
            return indexA - indexB;
        });
    }
}

function saveToLocalStorageC() {
    filters = company.map((item, index) => ({
        id: index + 1,
        idPass: item.idPass,
    }));
    localStorage.setItem("tabsOrder2", JSON.stringify(company));
}

function startFilterC() {
    companyFilter.forEach((init) => {
        company.push(init)
        // company.sort((a, b) => a.name.localeCompare(b.name));
    });
    console.log(company);
    console.log(companyFilter);

    loadFromLocalStorageC();
    CompanyMenuCreat()
}

/////////////////////// ---------- ///////////////////////

/////////////////////// добовления компаний и логига действия ///////////////////////
let addCompanyBut = document.querySelector('.add-company-but') // берем кнопку
addCompanyBut.onclick = (() => { // датчик нажатия на кнопку
    let trueFalseMenuCompany = confirm(`Для добовления нажмите → ОК
Для удаления нажмите → Отмена`) // текс для опроса для выбора между удалением и добовлением
    let hop = false // нужен для понятия совпадения

    if (trueFalseMenuCompany) { // для начало проверяет что нужно пользователю удалить или добавить
        let nameCompany = prompt('Назовите новую компанию: ') // спрашивает названия компания для добовления
        if (nameCompany) { // смотрит не пустой ли ответ
            saveDataCompany(nameCompany.trim()) // запускает создания компания

            saveCompanyTrue()
            listenToDataCompany()
            CompanyMenuCreat()
        } else {
            alert('В строке пусто!')
        }
    } else {
        let nameCompany = prompt('Напишите какую компанию: ') // спрашивает названия компании для удаления
        if (nameCompany) { // смотрит не пустой ли ответ
            company.forEach(element => {
                if (element.name === nameCompany.trim()) {
                    hop = true // определяет есть ли совпадение
                    deleteDataCompany(element.idPass, nameCompany)
                } else {
                }
            });
            if (!hop) {
                alert('Нет совбадений! или В строке пусто!')
            }
        }
    }
})
/////////////////////// ---------- ///////////////////////

/////////////////////// Создание нового драйвера ///////////////////////
async function saveData(name, company) {
    const userData = {
        id: Math.random(),
        name: name,
        statusAnd: 'Off',
        fromTime: '',
        tillTime: '',
        location: '',
        bottomTabText: '',
        notesImportant: true,
        company: company,
        LongIsland: true,
        queue: '',
        queueColor: '',
    }; // таблица ключей для сохранения в базу данных 
    try {
        const docRef = doc(collection(db, "masiv"));
        await setDoc(docRef, userData);
    } catch (e) {
        console.error("Ошибка при сохранении данных:", e);
    }
}
/////////////////////// ---------- ///////////////////////

/////////////////////// Получения драйверов через базу данных ///////////////////////
function listenToData() {
    const q = collection(db, "masiv");
    let g = '' // для филтра компаний 
    onSnapshot(q, (snapshot) => {
        masivfilter = []; // очищаем старый массив
        masiv = [] // очищаем старый массив
        masivOff = []
        companyTrue.forEach(element => { // поиск включенных компаний
            if (element.t) {
                g = element.name // сохранения включенных компаний
            }
        });
        snapshot.forEach((doc) => { // получения данных 
            let data = doc.data(); // получаем данные
            if (data.company == g) { // фильтрования и добовления с базы данных драйверов
                masivfilter.unshift({
                    id: doc.data().id,
                    idPass: doc.id,
                    name: doc.data().name,
                    statusAnd: doc.data().statusAnd,
                    fromTime: doc.data().fromTime,
                    tillTime: doc.data().tillTime,
                    location: doc.data().location,
                    bottomTabText: doc.data().bottomTabText,
                    notesImportant: doc.data().notesImportant,
                    company: doc.data().company,
                    LongIsland: doc.data().LongIsland,
                    queue: doc.data().queue,
                    queueColor: doc.data().queueColor,
                },) // кидает в масив для фильтрации
            }
            generalMasiv.push({
                id: doc.data().id,
                idPass: doc.id,
                name: doc.data().name,
                statusAnd: doc.data().statusAnd,
                fromTime: doc.data().fromTime,
                tillTime: doc.data().tillTime,
                location: doc.data().location,
                bottomTabText: doc.data().bottomTabText,
                notesImportant: doc.data().notesImportant,
                company: doc.data().company,
                LongIsland: doc.data().LongIsland,
                queue: doc.data().queue,
                queueColor: doc.data().queueColor,
            },) // нужен для удаления компаний с их нимим драйверами
        });
        startFilter(); // вызываем перерисовку сайта
    });
}
/////////////////////// ---------- ///////////////////////

/////////////////////// удаления драйверов ///////////////////////
async function deleteData(documentId) {
    try {
        await deleteDoc(doc(db, "masiv", documentId));
        listenToData(); // чтобы обновить список после удаления
        start(); // перерисовка
    } catch (e) {
        console.error("Ошибка при удалении документа:", e);
    }
}
/////////////////////// ---------- ///////////////////////

/////////////////////// изменения данных драйверов ///////////////////////
async function updateData(documentId, newData) {
    try {
        const docRef = doc(db, "masiv", documentId);
        await updateDoc(docRef, newData);
        listenToData();
        start();
        // не нужно вызывать start или listenToData — всё обновится автоматически
    } catch (e) {
        console.error("Ошибка при обновлении документа:", e);
    }
}
/////////////////////// ---------- ///////////////////////
listenToData();  // Получаем
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
let idTabs = 0 // нужен для подсчета драйверов и из нумерации
let filter = {
    LoadHas: true,
    Completing: true,
    Deadhead: true,
    Ready: true,
    Sleeping: true,
    XRM: true,
    NoInfo: true,
    Off: true,
} // нужен для фильтра по статусу



/////////////////////// сохраняет в логальную базу для фильтра по статусу ///////////////////////
function saveFilters() {
    localStorage.setItem('filter', JSON.stringify(filter));
}
/////////////////////// ---------- ///////////////////////

/////////////////////// получения и обработка данных о фильтре по статусу ///////////////////////
function loadFilters() {
    const data = localStorage.getItem('filter');
    if (data) {
        const loadedFilter = JSON.parse(data);
        filter = loadedFilter
    } else {
        saveFilters()
    }
}
loadFilters()
let customCheckboxReady = document.getElementById("custom-checkbox-Ready");
let customCheckboxOff = document.getElementById("custom-checkbox-Off");
let customCheckboxLoadHas = document.getElementById("custom-checkbox-LoadHas");
let customCheckboxCompleting = document.getElementById("custom-checkbox-Completing");
let customCheckboxDeadhead = document.getElementById("custom-checkbox-Deadhead");
let customCheckboxSleeping = document.getElementById("custom-checkbox-Sleeping");
let customCheckboxXRM = document.getElementById("custom-checkbox-XRM");
let customCheckboxNoInfo = document.getElementById("custom-checkbox-NoInfo");
if (filter.LoadHas) {
    customCheckboxLoadHas.setAttribute('checked', '')
}
if (filter.Completing) {
    customCheckboxCompleting.setAttribute('checked', '')
}
if (filter.Deadhead) {
    customCheckboxDeadhead.setAttribute('checked', '')
}
if (filter.Ready) {
    customCheckboxReady.setAttribute('checked', '')
}
if (filter.Sleeping) {
    customCheckboxSleeping.setAttribute('checked', '')
}
if (filter.XRM) {
    customCheckboxXRM.setAttribute('checked', '')
}
if (filter.NoInfo) {
    customCheckboxNoInfo.setAttribute('checked', '')
}
if (filter.Off) {
    customCheckboxOff.setAttribute('checked', '')
}
function checkbox() {
    customCheckboxReady = document.getElementById("custom-checkbox-Ready");
    customCheckboxOff = document.getElementById("custom-checkbox-Off");
    customCheckboxLoadHas = document.getElementById("custom-checkbox-LoadHas");
    customCheckboxCompleting = document.getElementById("custom-checkbox-Completing");
    customCheckboxDeadhead = document.getElementById("custom-checkbox-Deadhead");
    customCheckboxSleeping = document.getElementById("custom-checkbox-Sleeping");
    customCheckboxXRM = document.getElementById("custom-checkbox-XRM");
    customCheckboxNoInfo = document.getElementById("custom-checkbox-NoInfo");
    filter = {
        LoadHas: false,
        Completing: false,
        Deadhead: false,
        Ready: false,
        Sleeping: false,
        XRM: false,
        NoInfo: false,
        Off: false,
    } // обновления масива для фильтра по статусу
    if (customCheckboxReady.checked) { // изменения данных
        filter.Ready = true
    } else {
        filter.Ready = false
    }
    if (customCheckboxOff.checked) {
        filter.Off = true
    } else {
        filter.Off = false
    }
    if (customCheckboxLoadHas.checked) {
        filter.LoadHas = true
    } else {
        filter.LoadHas = false
    }
    if (customCheckboxCompleting.checked) {
        filter.Completing = true
    } else {
        filter.Completing = false
    }
    if (customCheckboxDeadhead.checked) {
        filter.Deadhead = true
    } else {
        filter.Deadhead = false
    }
    if (customCheckboxSleeping.checked) {
        filter.Sleeping = true
    } else {
        filter.Sleeping = false
    }
    if (customCheckboxXRM.checked) {
        filter.XRM = true
    } else {
        filter.XRM = false
    }
    if (customCheckboxNoInfo.checked) {
        filter.NoInfo = true
    } else {
        filter.NoInfo = false
    }
    if (!filter.Ready && !filter.Off && !filter.LoadHas && !filter.Completing && !filter.Deadhead && !filter.Sleeping && !filter.XRM && !filter.NoInfo) {
        filter = {
            LoadHas: true,
            Completing: true,
            Deadhead: true,
            Ready: true,
            Sleeping: true,
            XRM: true,
            NoInfo: true,
            Off: true,
        }
    }
    localStorage.setItem('filter', JSON.stringify(filter));
    startFilter()
}
checkbox()
customCheckboxReady.addEventListener('change', function (d) { // датчик нажатий
    checkbox()
    saveFilters()
})
customCheckboxOff.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxLoadHas.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxCompleting.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxDeadhead.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxSleeping.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxXRM.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})
customCheckboxNoInfo.addEventListener('change', function (d) {
    checkbox()
    saveFilters()

})


function changeColorStatus(colors) {
    if (typeof colors !== 'number' || isNaN(colors) || colors < 0 || colors > 1) {
        console.warn('Неверное значение прозрачности:', colors);
        return;
    }

    const colorMap = {
        'off': `rgba(172, 0, 0, ${colors})`,
        'load-Has': `rgba(255, 153, 1, ${colors})`,
        'Sleeping': `rgba(18, 1, 255, ${colors})`,
        'Completing': `rgba(110, 81, 0, ${colors})`,
        'XRM': `rgba(151, 0, 118, ${colors})`,
        'No-info': `rgba(145, 145, 145, ${colors})`,
        'Deadhead': `rgba(123, 151, 0, ${colors})`,
        'Ready': `rgba(111, 151, 0, ${colors})`
    };

    for (const className in colorMap) {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(el => {
            el.style.backgroundColor = colorMap[className];
            if (colors >= 0.8) {
                el.style.color = 'white'
            } else {
                el.style.color = 'black'
            }
        });
    }
}

const slider = document.getElementById("mySlider");
const valueDisplay = document.getElementById("slider-value");

slider.addEventListener("input", () => {
    valueDisplay.textContent = slider.value;
});

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("mySlider");

    // Загружаем сохранённое значение при загрузке страницы
    const savedValue = localStorage.getItem("mySlider");
    if (savedValue !== null) {
        slider.value = savedValue;
        valueDisplay.textContent = savedValue;
        changeColorStatus(parseFloat(savedValue))
    }

    // Сохраняем значение при изменении
    slider.addEventListener("input", () => {
        changeColorStatus(parseFloat(slider.value))
        localStorage.setItem("mySlider", slider.value);
    });
});

/////////////////////// ---------- ///////////////////////
let draggedEl = null;
let draggedIndex = null;




let colorQueue = ['rgba(255, 0, 0, 0.534)', 'rgba(255, 145, 0, 0.534)', 'rgba(10, 124, 0, 0.534)', 'rgba(0, 12, 124, 0.534)', 'rgba(124, 0, 103, 0.534)']
////////////////////////////////////////////// СОЗДАНИЯ ЯЧЕЕК ТАБЛИЦЫ //////////////////////////////////////////////
////////////////////////////////////////////// СОЗДАНИЯ ЯЧЕЕК ТАБЛИЦЫ //////////////////////////////////////////////
////////////////////////////////////////////// СОЗДАНИЯ ЯЧЕЕК ТАБЛИЦЫ //////////////////////////////////////////////
////////////////////////////////////////////// СОЗДАНИЯ ЯЧЕЕК ТАБЛИЦЫ //////////////////////////////////////////////
function start() {
    idTabs = 0 // нужен для подсчета
    mainTab.innerHTML = '' // очищайет для перерисовки  
    masiv.forEach((input, index) => {
        idTabs += 1
        input.id = idTabs
        mainTab = document.querySelector('.main-tab')
        var tab = document.createElement('div')
        var tabGeneral = document.createElement('div')
        var id = document.createElement('div')
        id.innerHTML = `<p>${idTabs}</p>`
        var name = document.createElement('div')
        name.innerHTML = `<p>${input.name}</p>`
        var statusAnd = document.createElement('select')
        statusAnd.addEventListener('change', function (e) {
            input.statusAnd = e.target.value
            updateData(input.idPass, { statusAnd: e.target.value, })
            start()
        })
        var options1 = document.createElement('option')
        var options2 = document.createElement('option')
        var options3 = document.createElement('option')
        var options4 = document.createElement('option')
        var options5 = document.createElement('option')
        var options6 = document.createElement('option')
        var options7 = document.createElement('option')
        var options8 = document.createElement('option')
        options1.innerHTML = 'Off'
        if (input.statusAnd == 'Off') {
            statusAnd.classList.add('off')
            options1.setAttribute('selected', '')
        }
        options2.innerHTML = 'Load Has'
        if (input.statusAnd == 'Load Has') {
            statusAnd.classList.add('load-Has')
            options2.setAttribute('selected', '')
            input.statu = true
        }
        options3.innerHTML = 'Sleeping'
        if (input.statusAnd == 'Sleeping') {
            statusAnd.classList.add('Sleeping')
            options3.setAttribute('selected', '')
            input.statu = false
        }
        options4.innerHTML = 'Completing'
        if (input.statusAnd == 'Completing') {
            statusAnd.classList.add('Completing')
            options4.setAttribute('selected', '')
            input.statu = true
        }
        options5.innerHTML = 'XRM'
        if (input.statusAnd == 'XRM') {
            statusAnd.classList.add('XRM')
            input.statu = false
            options5.setAttribute('selected', '')
        }
        options6.innerHTML = 'No info'
        if (input.statusAnd == 'No info') {
            statusAnd.classList.add('No-info')
            options6.setAttribute('selected', '')
            input.statu = false
        }
        options7.innerHTML = 'Deadhead'
        if (input.statusAnd == 'Deadhead') {
            statusAnd.classList.add('Deadhead')
            options7.setAttribute('selected', '')
            input.statu = true
        }
        options8.innerHTML = 'Ready'
        if (input.statusAnd == 'Ready') {
            statusAnd.classList.add('Ready')
            options8.setAttribute('selected', '')
            input.statu = true
        }
        var LongIsland = document.createElement('div')
        LongIsland.innerHTML = 'Long Island'

        var fromTime = document.createElement('div')
        var fromInput = document.createElement('input')
        fromInput.setAttribute('type', 'time')
        fromInput.setAttribute('lang', 'ru')
        fromInput.setAttribute('value', input.fromTime)
        fromInput.addEventListener('change', function (d) {
            input.fromTime = d.target.value
            updateData(input.idPass, { fromTime: d.target.value, })
            start()
        })
        var tillTime = document.createElement('div')
        var tillInput = document.createElement('input')
        tillInput.setAttribute('type', 'time')
        tillInput.setAttribute('lang', 'ru')
        tillInput.setAttribute('value', input.tillTime)
        tillInput.addEventListener('change', function (q) {
            input.tillTime = q.target.value
            updateData(input.idPass, { tillTime: q.target.value, })
            start()
        })
        ////////////////////// сравнивает время //////////////////////
        function hasTimePassed(tillTimes) {
            const [targetHours, targetMinutes] = tillTimes.split(':').map(Number);

            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();

            // Сравниваем часы
            if (currentHours > targetHours) return true;
            if (currentHours < targetHours) return false;

            // Если часы равны — сравниваем минуты
            return currentMinutes >= targetMinutes;
        }

        if (input.tillTime) {
            if (hasTimePassed(input.tillTime)) {
                tillInput.style.backgroundColor = 'rgb(172, 0, 0, 0.4)'
            } else {
            }
        }
        ////////////////////// сравнивает время ////////////////////// 
        var location = document.createElement('div')
        var localInput = document.createElement('input')
        localInput.setAttribute('type', 'text')
        localInput.value = input.location
        localInput.addEventListener('change', function (a) {
            input.location = a.target.value
            updateData(input.idPass, { location: a.target.value, })
            start()
        })
        // Queue // Queue // Queue // Queue //

        let queue = document.createElement('div')
        let queueInput = document.createElement('input')
        queueInput.value = input.queue
        queueInput.addEventListener('change', function (a) {
            input.location = a.target.value
            updateData(input.idPass, { queue: a.target.value, })
            start()
        })
        queueInput.setAttribute('maxlength', '2')
        if (input.queueColor == '') {
            queueInput.style.backgroundColor = '#7b969b'
        }else {
            queueInput.style.backgroundColor = input.queueColor
        }

        let QueueLeft = document.createElement('div')
        let QueueLeftBox1 = document.createElement('div')
        let QueueLeftBox2 = document.createElement('div')
        let QueueLeftBox3 = document.createElement('div')
        let QueueLeftBox4 = document.createElement('div')
        let QueueLeftBox5 = document.createElement('div')
        let QueueLeftClear = document.createElement('div')

        // Queue // Queue // Queue // Queue //
        let ulLocal = document.createElement('ul')
        // Creat Notes
        var bottomTab = document.createElement('div')
        var bottomTabText = document.createElement('input')
        localInput.setAttribute('type', 'text')
        bottomTabText.value = input.bottomTabText
        bottomTabText.setAttribute('placeholder', 'Note:')
        bottomTabText.addEventListener('change', function (s) {
            input.bottomTabText = s.target.value
            updateData(input.idPass, { bottomTabText: s.target.value, })
            start()
        })
        // Creat Notes button Important
        var bottomTabImportant = document.createElement('div')
        bottomTabImportant.innerHTML = '!'
        // Add function onclick 
        bottomTabImportant.onclick = (() => {
            if (input.notesImportant) {
                bottomTabImportant.classList.remove('bottomTabImportantFalse')
                bottomTabText.classList.remove('bottomTabTextFalse')
                updateData(input.idPass, { notesImportant: false, })
                start()
            } else {
                bottomTabImportant.classList.add('bottomTabImportantFalse')
                bottomTabText.classList.add('bottomTabTextFalse')
                updateData(input.idPass, { notesImportant: true, })
                start()
            }
        })
        // Creat menu
        var menuMousemove = document.createElement('div')
        var menuMousemoveSetting = document.createElement('div')
        var menuMousemoveGeneralDelet = document.createElement('div')
        // var menuMousemoveHR = document.createElement('hr')
        // Добовляем текс для интерфейса 
        menuMousemoveSetting.innerHTML = 'Delet'
        menuMousemoveGeneralDelet.innerHTML = 'Clear'
        menuMousemove.style.display = 'none'
        // Теперь после клика на настройки
        menuMousemoveSetting.onclick = (() => {
            let isBoss = confirm("Вы хотите удалить: " + input.name + " 👍🗑️👎");
            if (isBoss) {
                masiv.splice(index, 1);
                start()
                deleteData(input.idPass)
            }
        })
        menuMousemoveGeneralDelet.onclick = (() => {
            let isBossS = confirm("Вы хотите очистить ячейку: " + input.name + " 👍🧹👎");
            if (isBossS) {
                updateData(input.idPass, {
                    statusAnd: 'Off',
                    fromTime: '',
                    tillTime: '',
                    location: '',
                    bottomTabText: '',
                    queue: '',
                    notesImportant: true,
                })
                listenToData()
                start()
            }
        })
        // Сохраняем что он сейчас действует или нет 
        let openTrueORFalse = false
        // Тут мы следим за тем если мышь зашла 
        // bottomTabImportant.addEventListener('mousemove', (e) => {
        //     menuMousemove.style.display = 'block'
        //     openTrueORFalse = true
        // });
        // // Тут мы следим за тем если мышь вышла 
        // bottomTabImportant.addEventListener('mouseleave', () => {
        //     openTrueORFalse = false
        //     setTimeout(() => {
        //         if (!openTrueORFalse) {
        //             menuMousemove.style.display = 'none'
        //         }
        //     }, 80);
        // });
        // Прочее
        // menuMousemove.addEventListener('mousemove', (e) => {
        //     openTrueORFalse = true
        // });
        // menuMousemove.addEventListener('mouseleave', () => {
        //     menuMousemove.style.display = 'none'
        // });
        if (input.notesImportant) {
            bottomTabImportant.classList.remove('bottomTabImportantFalse')
            bottomTab.classList.remove('bottomTabTextFalse')
        } else {
            bottomTabImportant.classList.add('bottomTabImportantFalse')
            bottomTab.classList.add('bottomTabTextFalse')
        }
        tab.classList.add('tab')
        tabGeneral.classList.add('tab-general')
        id.classList.add('id', 'tab-section')
        name.classList.add('name')
        statusAnd.classList.add('status-and')
        fromTime.classList.add('from-time', 'tab-section')
        tillTime.classList.add('till-time', 'tab-section')
        location.classList.add('location', 'tab-section')
        queue.classList.add('queue', 'tab-section')
        bottomTab.classList.add('bottom-tab')
        bottomTabImportant.classList.add('bottomTabImportant')
        menuMousemove.classList.add('menuMousemove')
        menuMousemoveSetting.classList.add('menuMousemoveSetting')
        menuMousemoveGeneralDelet.classList.add('menuMousemoveGeneralDelet')
        ulLocal.classList.add('autocomplete-list')
        LongIsland.classList.add('LongIsland')
        QueueLeft.classList.add('QueueLeft')
        QueueLeftBox1.classList.add('QueueLeftBox1', 'QueueLeftBox')
        QueueLeftBox2.classList.add('QueueLeftBox2', 'QueueLeftBox')
        QueueLeftBox3.classList.add('QueueLeftBox3', 'QueueLeftBox')
        QueueLeftBox4.classList.add('QueueLeftBox4', 'QueueLeftBox')
        QueueLeftBox5.classList.add('QueueLeftBox5', 'QueueLeftBox')
        QueueLeftClear.classList.add('QueueLeftClear', 'QueueLeftBox')
        if (input.LongIsland) {
            LongIsland.classList.add('Ready')
        } else {
            LongIsland.classList.add('off')
        }
        let hr = document.createElement('hr')
        hr.classList.add('hr')
        mainTab.append(tab)
        tab.append(tabGeneral, bottomTab, ulLocal)
        bottomTab.append(bottomTabText, bottomTabImportant, menuMousemove)
        menuMousemove.append(menuMousemoveSetting, menuMousemoveGeneralDelet)
        tabGeneral.append(id, name, statusAnd, fromTime, tillTime, LongIsland, location, queue)
        fromTime.append(fromInput)
        tillTime.append(tillInput)
        location.append(localInput)
        queue.append(queueInput, QueueLeft)
        QueueLeft.append(QueueLeftBox1, QueueLeftBox2, QueueLeftBox3, QueueLeftBox4, QueueLeftBox5, QueueLeftClear)
        statusAnd.append(options1, options8, options2, options3, options4, options5, options6, options7,)
        localInput.addEventListener("input", async function () {
            const query = localInput.value.trim();
            if (query.length > 1) { // начинаем поиск после ввода 3 символов
                try {
                    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=d57205eea2254d43b5eb9bddc596e5c4`);
                    const data = await response.json();
                    // Фильтруем только города
                    const suggestions = data.results.map(item => {
                        // Извлекаем только город и штат из полного адреса
                        const fullAddress = item.formatted;
                        const shortAddress = fullAddress.match(/^([A-Za-z\s]+, [A-Za-z]{2})/);
                        // Если удалось извлечь город и штат
                        if (shortAddress) {
                            return shortAddress[0];
                        } else {
                            // return fullAddress; // Если не удалось, возвращаем полный адрес
                        }
                    });
                    // Очистка списка перед добавлением новых вариантов
                    ulLocal.innerHTML = '';
                    if (suggestions.length > 0) {
                        suggestions.forEach(suggestion => {
                            const listItem = document.createElement("li");
                            listItem.textContent = suggestion;
                            listItem.addEventListener("click", () => {
                                localInput.value = suggestion; // вставляем выбранный город в input
                                ulLocal.innerHTML = ''; // очищаем список после выбора
                            });
                            ulLocal.appendChild(listItem);
                        });
                    } else {
                        const noResults = document.createElement("li");
                        noResults.textContent = "Нет результатов";
                        noResults.style.textAlign = "center";
                        ulLocal.appendChild(noResults);
                    }
                } catch (error) {
                    console.error("Error fetching data from API:", error);
                }
            } else {
                ulLocal.innerHTML = ''; // очищаем список, если ввод меньше 3 символов
            }
        });
        // Добавление функции навигации по результатам (например, с помощью клавиш вверх и вниз)
        let selectedIndex = -1;
        localInput.addEventListener("keydown", (e) => {
            const items = ulLocal.querySelectorAll("li");
            if (e.key === "ArrowDown") {
                selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
                updateSelection(items);
            } else if (e.key === "ArrowUp") {
                selectedIndex = Math.max(0, selectedIndex - 1);
                updateSelection(items);
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                localInput.value = items[selectedIndex].textContent;
                ulLocal.innerHTML = ''; // очищаем список после выбора
            }
        });

        function updateSelection(items) {
            items.forEach((item, index) => {
                if (index === selectedIndex) {
                    item.classList.add("selected");
                } else {
                    item.classList.remove("selected");
                }
            });
        }
        // Search Local //
        tab.setAttribute("draggable", true);
        tab.dataset.index = index;
        // Слушатели событий перетаскивания
        tab.addEventListener("dragstart", dragStart);
        tab.addEventListener("dragover", dragOver);
        tab.addEventListener("drop", drop);
        tab.addEventListener("dragend", dragEnd);
        tab.addEventListener("dragenter", dragEnter);
        tab.addEventListener("dragleave", dragLeave);
        changeColorStatus(parseFloat(slider.value))
        // swap ----------- //

        /////////////// условия удерживания кнопки Long Island ///////////////
        let holdTimer = null;

        // Время анимации — 500ms (должно совпадать с CSS)
        const animationDuration = 2000;

        function longPressAction() {
            if (input.LongIsland) {
                updateData(input.idPass, { LongIsland: false, })
                input.LongIsland = false
                // Здесь твоя логика для "Да"
            } else {
                input.LongIsland = true
                updateData(input.idPass, { LongIsland: true, })
                // Здесь твоя логика для "Нет"
            }
            start()
        }

        LongIsland.addEventListener('mousedown', () => {
            holdTimer = setTimeout(() => {
                longPressAction();
            }, animationDuration);
        });

        LongIsland.addEventListener('mouseup', () => {
            clearTimeout(holdTimer); // Если отпустил раньше — сброс
        });

        LongIsland.addEventListener('mouseleave', () => {
            clearTimeout(holdTimer); // Если ушёл курсором — сброс
        });

        // Для мобильных:
        LongIsland.addEventListener('touchstart', () => {
            holdTimer = setTimeout(() => {
                longPressAction();
            }, animationDuration);
        });

        LongIsland.addEventListener('touchend', () => {
            clearTimeout(holdTimer);
        });

        let stylesQueueLeft = getComputedStyle(QueueLeft);
        let widthQueueLeft = parseFloat(stylesQueueLeft.width); // получаем ширину
        let leftQueueLeft = parseFloat(stylesQueueLeft.left);   // получаем позицию слева
        // let QueueLeftBox = document.querySelectorAll('.QueueLeftBox')

        // console.log('Width:', widthQueueLeft, 'Left:', leftQueueLeft);

        // Пример проверки — открыть/закрыть меню

        const animationDuration2 = 500;

        function QueueLeftBut() {
            stylesQueueLeft = getComputedStyle(QueueLeft);
            widthQueueLeft = parseFloat(stylesQueueLeft.width);
            leftQueueLeft = parseFloat(stylesQueueLeft.left);

            if (widthQueueLeft == 20 || leftQueueLeft == 5) {
                console.log("Меню закрыто - открыто");
                QueueLeft.style.left = '-150px'
                QueueLeft.style.width = '150px'
                // открыть меню
            } else {
                console.log("Меню открыто - закрыто");
                QueueLeft.style.left = '5px'
                QueueLeft.style.width = '20px'
                // закрыть меню
            }
        }

        queueInput.addEventListener('mousedown', () => {
            holdTimer = setTimeout(() => {
                QueueLeftBut();
            }, animationDuration2);
        });

        queueInput.addEventListener('mouseup', () => {
            clearTimeout(holdTimer); // Если отпустил раньше — сброс
        });

        queueInput.addEventListener('mouseleave', () => {
            clearTimeout(holdTimer); // Если ушёл курсором — сброс
        });

        // Для мобильных:
        queueInput.addEventListener('touchstart', () => {
            holdTimer = setTimeout(() => {
                QueueLeftBut();
            }, animationDuration2);
        });

        queueInput.addEventListener('touchend', () => {
            clearTimeout(holdTimer);
        });


        QueueLeftBox1.onclick = (() => {
            updateData(input.idPass, { queueColor: '#ff7777', })
            // start()
        })
        QueueLeftBox2.onclick = (() => {
            updateData(input.idPass, { queueColor: '#ffc477', })
            // start()
        })
        QueueLeftBox3.onclick = (() => {
            updateData(input.idPass, { queueColor: '#7cb977', })
            // start()
        })
        QueueLeftBox4.onclick = (() => {
            updateData(input.idPass, { queueColor: '#777db9', })
            // start()
        })
        QueueLeftBox5.onclick = (() => {
            updateData(input.idPass, { queueColor: '#b977ae', })
            // start()
        })
        QueueLeftClear.onclick = (() => {
            updateData(input.idPass, { queueColor: '', })
            // start()
        })





        // QueueLeft.onclick = (() => {
        //     // Назначаем обработчики только один раз
        //     const QueueLeftBox = document.querySelectorAll('.QueueLeftBox');
        //     QueueLeftBox.forEach((element, id) => {
        //         // Привязываем обработчик клика для каждого элемента
        //         element.onclick = (() => {
        //             // console.log(id);
        //             const bgColor = getComputedStyle(element).backgroundColor;
        //             updateData(input.idPass, { queueColor: bgColor, })
        //             start()
        //             // queueInput.style.backgroundColor = bgColor;
        //             // console.log(input.name);
        //         });
        //     });

        //     // Вызов функции, если необходимо
        //     QueueLeftBut();
        // });

        /////////////// -------------------------------------- ///////////////
    });

}
////////////////////////////////////////////// ---------------------- //////////////////////////////////////////////
////////////////////////////////////////////// ---------------------- //////////////////////////////////////////////
////////////////////////////////////////////// ---------------------- //////////////////////////////////////////////
////////////////////////////////////////////// ---------------------- //////////////////////////////////////////////

let tabs = document.querySelectorAll('.tab')

// Событие начала перетаскивания
function dragStart(e) {
    draggedEl = e.target;
    draggedIndex = +e.target.dataset.index;
    e.target.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ""); // нужно для Firefox
    document.body.classList.add("drag-cursor-grabbing");
}

// При наведении на другой блок
function dragEnter(e) {
    e.preventDefault();
    const enterTarget = e.target.closest(".tab");
    if (!enterTarget || enterTarget === draggedEl) return;
    enterTarget.classList.add("placeholder");
    document.body.classList.remove("drag-cursor-grabbing");
    document.body.classList.add("drag-cursor-grab");
}
// Убираем подсветку
function dragLeave(e) {
    e.preventDefault();
    const enterTarget = e.target.closest(".tab");
    if (!enterTarget || enterTarget === draggedEl) return;
    e.target.classList.remove("placeholder");
    document.body.classList.remove("drag-cursor-grab");
    document.body.classList.add("drag-cursor-grabbing");
}
// Разрешаем дроп
function dragOver(e) {
    e.preventDefault();
}
// Когда отпускаем блок
function drop(e) {
    e.preventDefault();
    const dropTarget = e.target.closest(".tab");
    if (!dropTarget || dropTarget === draggedEl) return;
    dropTarget.classList.remove("placeholder");
    const targetIndex = +dropTarget.dataset.index;
    if (targetIndex === draggedIndex) return;
    const draggedItem = masiv[draggedIndex];
    masiv.splice(draggedIndex, 1);
    masiv.splice(targetIndex, 0, draggedItem);
    saveToLocalStorage()
    start();
}
// Конец перетаскивания
function dragEnd(e) {
    e.target.classList.remove("dragging");
    document.body.classList.remove("drag-cursor-grabbing");
    document.body.classList.remove("drag-cursor-grab");
}
// Swap ----------- //
function loadFromLocalStorage() {
    const data = localStorage.getItem("tabsOrder");
    if (data) {
        filters = JSON.parse(data);
        masiv.sort((a, b) => {
            const indexA = filters.findIndex(f => f.idPass === a.idPass);
            const indexB = filters.findIndex(f => f.idPass === b.idPass);
            return indexA - indexB;
        });
    }
}

function saveToLocalStorage() {
    filters = masiv.map((item, index) => ({
        id: index + 1,
        idPass: item.idPass,
    }));
    localStorage.setItem("tabsOrder", JSON.stringify(filters));
}
let creatDiv = document.querySelector('.creat-div')
let creatss = document.querySelector('.creat')
let nameCreat = document.querySelector('.name-creat')
let idDelet = document.querySelector('.id-delet')
let InameCreat = document.querySelector('#name-creat')
let IidDelet = document.querySelector('#id-delet')
let creatOffReady = false
creatss.onclick = (() => {
    if (creatOffReady) {
        creatDiv.style.left = '-50vh'
        creatOffReady = false
        creatss.innerHTML = '>'
    } else {
        creatDiv.style.left = '0'
        creatOffReady = true
        creatss.innerHTML = '<'
    }
})

nameCreat.addEventListener('click', async () => {
    creatDiv.style.left = '-50vh'
    creatOffReady = false
    creatss.innerHTML = '>'
    const nameInput = InameCreat.value.trim();
    if (nameInput === '') {
        alert("Введите имя!");
        return;
    }
    let companys = ''
    companyTrue.forEach(element => {
        if (element.t) {
            companys = element.name
        }
    });
    if (companys === '') {
        alert('Компания не выбрана!')
    } else {
        await saveData(nameInput, companys);
    }
    InameCreat.value = ''
});

idDelet.onclick = (() => {
    creatDiv.style.left = '-50vh'
    creatOffReady = false
    creatss.innerHTML = '>'
    masiv.forEach((inp, ids) => {
        if (String(inp.id) === IidDelet.value.trim()) {
            masiv.splice(ids, 1);
            start()
            deleteData(inp.idPass)
        }
    });
    IidDelet.value = ''
})
function startFilter() {
    masiv = []
    masivOff = []
    if (filter.LoadHas) {
        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Load Has') {
                masiv.push(init)
                masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.Completing) {
        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Completing') {
                masiv.push(init)
                // masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.Deadhead) {
        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Deadhead') {
                masiv.push(init)
                // masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.Ready) {
        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Ready') {
                filterReadyReady.push(init)
                filterReadyReady.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
        filterReadyReady.sort((a, b) => {
            const getMinutes = (time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };

            return getMinutes(a.fromTime) - getMinutes(b.fromTime);
        });
        filterReadyReady.forEach((init) => {
            masiv.push(init)
        });
        filterReadyReady = []
    }
    if (filter.Sleeping) {
        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Sleeping') {
                masiv.push(init)
                // masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.XRM) {

        masivfilter.forEach((init) => {
            if (init.statusAnd == 'XRM') {
                masiv.push(init)
                // masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.NoInfo) {

        masivfilter.forEach((init) => {
            if (init.statusAnd == 'No info') {
                masiv.push(init)
                // masiv.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
    if (filter.Off) {

        masivfilter.forEach((init) => {
            if (init.statusAnd == 'Off') {
                masivOff.push(init)
            }
        });
        masivOff.sort((a, b) => a.name.localeCompare(b.name));
        masivOff.forEach(element => {
            masiv.push(element)
        });
    }
    loadFromLocalStorage();
    start()
}
let filtersBut = document.querySelector('.filters')
function filtersButClear() {
    localStorage.removeItem('tabsOrder');
    startFilter()
}
filtersBut.addEventListener('click', filtersButClear);

///////////////////////////////////////////////////////////
const mainBox = document.querySelector(".main-tab");
const positionMenu = document.querySelector(".positionMenu");
const buttons = positionMenu.querySelectorAll("img");

// Функция применить выравнивание и выделить активную кнопку
function applyAlignment(alignValue) {
    mainBox.style.alignItems = alignValue;
    buttons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.align === alignValue);
    });
}

// Загрузка при старте
window.addEventListener("DOMContentLoaded", () => {
    const savedAlign = localStorage.getItem("blockAlign") || "center";
    applyAlignment(savedAlign);
});

// Обработка клика
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const align = btn.dataset.align;
        localStorage.setItem("blockAlign", align);
        applyAlignment(align);
    });
});
/////////////////////////////

let menuBut = document.querySelector('.menu-but')
let aside = document.querySelector('aside')

let asideTrue = false


menuBut.onclick = (() => {
    if (asideTrue) {
        asideTrue = false
        aside.style.left = '-50vh'
        const savedAlign = localStorage.getItem("blockAlign") || "center";
        applyAlignment(savedAlign);
    } else {
        asideTrue = true
        aside.style.left = '0'
        mainBox.style.alignItems = 'flex-end';
    }
})




// SETTING SETTING SETTING ///////////////// SETTING SETTING SETTING //
////////////////////////////// SETTING //////////////////////////////
// SETTING SETTING SETTING ///////////////// SETTING SETTING SETTING //
let GeneralBody = document.querySelector('body')
let AsideScroll = document.querySelector('.aside-scroll')
let FilterBox = document.querySelector('.FilterBox')
let SettingPosition = document.querySelector('.setting-position')
let FilterCheckBox = document.querySelectorAll('.custom-checkbox')
let SettingDesign = document.querySelector('.setting-design')

let setting = {
    filters: 'outside',
}

// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ //
let filterOnOff = {
    centerFilter: true,
    mainCenter: true,
}
let centerFilter = document.querySelector('.center-filter')
let mainAnim = document.querySelector('main')
let mainCenter = document.querySelector('.main-center')

let CenterFilterAnim = document.querySelector('.center-filter-anim')

CenterFilterAnim.onclick = (() => {
    if (setting.filters == 'outsde') {
        if (filterOnOff.centerFilter) {
            filterOnOff.centerFilter = false
            centerFilter.style.top = '7vh'
            mainAnim.style.top = '15vh'
            mainAnim.style.height = '84vh'
            CenterFilterAnim.style.top = '12vh'
            CenterFilterAnim.innerHTML = '▲'
        } else if (filterOnOff.centerFilter == false && filterOnOff.mainCenter == true) {
            filterOnOff.mainCenter = false
            mainCenter.style.top = '2vh'
            centerFilter.style.top = '2vh'
            mainAnim.style.top = '10vh'
            CenterFilterAnim.style.top = '7vh'
            CenterFilterAnim.innerHTML = '▼'
            mainAnim.style.height = '89vh'
        } else {
            filterOnOff.centerFilter = true
            filterOnOff.mainCenter = true
            mainCenter.style.top = '7vh'
            centerFilter.style.top = '12vh'
            mainAnim.style.top = '20vh'
            CenterFilterAnim.style.top = '17vh'
            CenterFilterAnim.innerHTML = '▲'
            mainAnim.style.height = '80vh'
        }
    } else {
        if (filterOnOff.centerFilter == false && filterOnOff.mainCenter == true) {
            filterOnOff.mainCenter = false
            mainCenter.style.top = '2vh'
            centerFilter.style.top = '2vh'
            mainAnim.style.top = '10vh'
            CenterFilterAnim.style.top = '7vh'
            CenterFilterAnim.innerHTML = '▼'
            mainAnim.style.height = '89vh'
        } else {
            filterOnOff.centerFilter = false
            filterOnOff.mainCenter = true
            mainCenter.style.top = '7vh'
            centerFilter.style.top = '7vh'
            mainAnim.style.top = '15vh'
            CenterFilterAnim.style.top = '12vh'
            CenterFilterAnim.innerHTML = '▲'
            mainAnim.style.height = '84vh'
        }
    }
})
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ //

function settings() {
    // filters //
    if (setting.filters == 'outside') {
        GeneralBody.append(FilterBox)
        FilterBox.classList.add('center-filter')
        FilterBox.classList.remove('center-filter2')
        FilterCheckBox.forEach(element => {
            element.classList.remove('checkbox-setting-position')
            element.classList.add('custom-checkbox')
        });
        filterOnOff.centerFilter = true
        filterOnOff.mainCenter = true
        mainCenter.style.top = '7vh'
        centerFilter.style.top = '12vh'
        mainAnim.style.top = '20vh'
        CenterFilterAnim.style.top = '17vh'
        CenterFilterAnim.innerHTML = '▲'
        mainAnim.style.height = '80vh'
    } else {
        AsideScroll.append(FilterBox, SettingPosition, SettingDesign)
        FilterBox.classList.add('center-filter2')
        FilterBox.classList.remove('center-filter')
        FilterCheckBox.forEach(element => {
            element.classList.add('checkbox-setting-position')
            element.classList.remove('custom-checkbox')
        });
        filterOnOff.centerFilter = false
        centerFilter.style.top = '7vh'
        mainAnim.style.top = '15vh'
        mainAnim.style.height = '84vh'
        CenterFilterAnim.style.top = '12vh'
        CenterFilterAnim.innerHTML = '▲'
    }
    // filters esc //
}

settings()

document.querySelectorAll('input[name="filters"]').forEach(radio => {
    radio.addEventListener('change', () => {
        console.log(`Выбрано: ${radio.value}`);
        setting.filters = radio.value
        settings()
    });
});