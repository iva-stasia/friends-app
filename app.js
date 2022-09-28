'use strict';

const cardsContainer = document.querySelector('.cards_container');
const searchInput = document.querySelector('input[type=search]');
const sideBar = document.querySelector('.filters');
const resetBtn = document.querySelector('input[type=reset]');
const filtersHeader = document.querySelector('.filter_header');

let initialFriends = [];
let copyFriends = [];

const getinitialFriends = async () => {
    const url = `https://randomuser.me/api/?inc=gender,name,location,email,dob,cell,picture&results=24`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        initialFriends = data.results;
        copyFriends = [...initialFriends]
        createCards(initialFriends);
    } catch (e) {
        console.log(e);
    };
};

const createCards = (initialFriends) => {
    const htmlinitialFriendsData = initialFriends.map(friend => {
        return `
            <div class="card glass_bg">
                <img class="photo" src="${friend.picture.large}" alt="person photo" />
                <h2 class="name text">${friend.name.first}</h2>
                <h2 class="name text">${friend.name.last}</h2>
                <span class="additional_info text">${friend.dob.age} y. o., ${friend.gender}</span>
                <span class="additional_info text">
                    <i class="fa-solid fa-location-dot"></i> ${friend.location.country}
                </span>
                <a class="email glass_btn" href="${friend.email}">
                    <i class="fa-solid fa-envelope"></i>
                </a>
                <a class="phone glass_btn" href="${friend.cell}">
                    <i class="fa-solid fa-phone"></i>
                </a>
                <div class="follow_btn glass_btn">Follow</div>
            </div>
        `;
    }).join('');

    cardsContainer.innerHTML = htmlinitialFriendsData;
};

const changeFriends = ({target}) => {
    const foundFriends = searchFriends(target.value);
    const filteredFriends = filter(foundFriends);
    const sortedFriends = sort(filteredFriends);

    createCards(sortedFriends);
};

const filter = (friendsData) => {
    if (sideBar[4].checked) {
        return friendsData.filter(friend => friend.gender === 'male');
    };

    if (sideBar[5].checked) {
        return friendsData.filter(friend => friend.gender === 'female');
    };

    if (!sideBar[4].checked && !sideBar[5].checked) {
        return friendsData;
    };
};

const sort = (friendsData) => {
    if (sideBar[0].checked) {
        return friendsData.sort((a, b) => a.name.first < b.name.first ? -1 : 1);
    };

    if (sideBar[1].checked) {
        return friendsData.sort((a, b) => a.name.first > b.name.first ? -1 : 1);
    };

    if (sideBar[2].checked) {
        return friendsData.sort((a, b) => a.dob.age < b.dob.age ? -1 : 1);
    };

    if (sideBar[3].checked) {
        return friendsData.sort((a, b) => a.dob.age > b.dob.age ? -1 : 1);
    };

    if (!sideBar[0].checked && !sideBar[1].checked && !sideBar[2].checked && !sideBar[3].checked) {
        return friendsData
    };  
};

const searchFriends = (value) => {
    if (searchInput.value !== '') {
        const searchString = searchInput.value.toLowerCase().trim();
        return copyFriends.filter(friend => {
            return (
                friend.name.first.toLowerCase().includes(searchString)
                || friend.name.last.toLowerCase().includes(searchString)
            );
        });
    }
    else{
        return copyFriends;
    };
};

const resetAll = () => {
    searchInput.value = '';
    copyFriends = [...initialFriends]
    createCards(copyFriends);
};

const openFilters = ({target}) => {
    if (target.classList.contains('app_name')
        || target.classList.contains('filter_header')) return;

    if (target.classList.contains('fa-filter')
        || target.classList.contains('filter_btn')) {
        sideBar.classList.toggle('open');
        filtersHeader.classList.remove('open_search');
        document.querySelector('.search_block').classList.remove('open_search');
    };

    if (target.classList.contains('fa-magnifying-glass')
        || target.classList.contains('search_btn')) {
        filtersHeader.classList.toggle('open_search');
        document.querySelector('.search_block').classList.toggle('open_search');
        document.querySelector('.search_block').classList.remove('glass_bg');
        sideBar.classList.remove('open');
    };
};

sideBar.addEventListener('input', changeFriends);
searchInput.addEventListener('input', changeFriends);
resetBtn.addEventListener('click', resetAll);
filtersHeader.addEventListener('click', openFilters);

getinitialFriends();
