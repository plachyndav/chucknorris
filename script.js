window.onload = function () {
    function request(method, address, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, address, true);
        xhr.addEventListener('load', function (event) {
            var body = event.target.response;
            cb(body);
        });
        xhr.send();
    }

    var joke = document.querySelector('.joke');
    var randomButton = document.querySelector('.btn-random');
    var moreButton = document.querySelector('.btn-more');
    var categoriesList = document.querySelector('.categories-list');
    var selectedCategory;
    var more = true;

    function getCategories() {
        request('GET', 'https://api.chucknorris.io/jokes/categories', function (data) {
            var categories = JSON.parse(data);
            categories.forEach(function (element, index) {
                var item = document.createElement('li');
                item.classList.add('categories-item');
                var link = document.createElement('a');
                link.innerHTML = element;
                link.setAttribute("href", "");
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    getJoke(element);
                    selectedCategory = element;
                    [].forEach.call(categoriesList.children, function (el) { el.classList.remove('categories-item--active') });
                    link.parentElement.classList.add('categories-item--active');
                }, false);
                item.appendChild(link);
                if (index > 9) { item.classList.add('hidden') };
                categoriesList.appendChild(item);
            });
        });
    }

    function getJoke(category) {
        if (category) {
            category = '?category=' + category
        } else {
            category = '';
        }
        request('GET', 'https://api.chucknorris.io/jokes/random' + category, function (data) {
            joke.innerHTML = '\"' + JSON.parse(data).value + '\"';
        });
    }

    getCategories();
    getJoke();

    moreButton.addEventListener('click', function (e) {
        e.preventDefault();
        if (more) {
            for (var i = 9; i < categoriesList.children.length; i++) {
                categoriesList.children[i].classList.remove('hidden')
            }
            more = false;
            moreButton.innerHTML = "less";
        } else {
            for (var i = 10; i < categoriesList.children.length; i++) {
                categoriesList.children[i].classList.add('hidden')
            }
            more = true;
            moreButton.innerHTML = "more";
        }
    }, false);

    randomButton.addEventListener('click', function (e) {
        e.preventDefault();
        getJoke(selectedCategory);
    }, false);
}