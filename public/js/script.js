const postContainer = document.getElementById('posts');
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}




const printFeed = async () => {
    let response
    try {
        response = await axios.get('http://localhost:3000/posts');
    } catch (err) {
        console.error(err)
    }
    if (response) {
        console.log(response)
        const postsHTML = response.data.map(post => `
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
            <a href="http://localhost:3000/posts/${post.slug}">
                <div class="px-6 py-4">
                    <p class="text-gray-600 text-sm"><span class="font-bold me-2">${post.author}</span> ${formatDate(post.creation_date)}</p>
                </div>
                <img class="h-[300px] object-cover w-full" src="${post.image}" alt="${post.title}">
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">${post.title}</div>
                    <p class="text-gray-700 text-base">${post.content}</p>
                </div>
                <div class="px-6 py-4">
                    ${post.tags.map(tag => `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">${tag}</span>`).join('')}
                </div>
                </a>
                <form class="px-6 py-4" action="http://localhost:3000/posts/${post.slug}/comment" method="post">
                    <textarea name="comment"></textarea>
                    <input type="submit" value="Leave a comment" />
                </form>
            </div>

        `).join('');

        postContainer.innerHTML += postsHTML;
        // const form = document.querySelectorAll('form')
        // form.forEach(f => {
        //     f.addEventListener('click', (event) => {
        //         event.preventDefault()
        //     })
        // })
    }
}

printFeed()