document.addEventListener('DOMContentLoaded', () => {
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    nextButton.addEventListener('click', () => {
        page1.classList.remove('active');
        page2.classList.add('active');
    });

    prevButton.addEventListener('click', () => {
        page2.classList.remove('active');
        page1.classList.add('active');
    });

    let page = 1;
    let loading = false;

    window.addEventListener('scroll', () => {
        if (loading) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            page++;
            fetchData(page);
        }
    });

    fetchData(page);
});

async function fetchData(page = 1) {
    try {
        loading = true;

        const perPage = 30;

        const response1 = await fetch(`https://api.github.com/search/users?q=followers:>0&sort=followers&order=desc&page=${page}&per_page=${perPage}`);
        const data = await response1.json();
        console.log(data, "data");
        renderUsers(data.items);

        

        const response2 = await fetch(`https://api.github.com/search/repositories?q=stars:>0&sort=stars&order=&page=${page}&per_page=${perPage}`);
        const repoData = await response2.json();
        console.log(repoData,'second api' );
        renderStars(repoData.items);
    } catch (error) {
        console.log("Error: ", error);
    } finally {
        loading = false;
    }
}


function renderUsers(users) {
    const userList = document.getElementById('userList');
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <h2>${user.id}</h2>
            <h3>${user.type}</h3>
            <h3>${user.login}</h3>
            <a href="${user.html_url}">View Profile</a>
            <br>
        `;
        userList.appendChild(userCard);
    });
}

function renderStars(repos) {

    
    const repoList = document.getElementById('repoList');

    repos.forEach(repo => {
        const { name, id, stargazers_count, html_url } = repo;

        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');

        repoCard.innerHTML = `
            <h2 class="repo-name">name: ${name}</h2>
            <p class="repo-description">id: ${id}</p>
            <p class="repo-stars">Stars: ${stargazers_count}</p>
            <a href="${html_url}" class="repo-list">View Repo</a>
            <br>
        `;

        repoList.appendChild(repoCard);
    });
}
