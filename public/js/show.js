const cardHTML = document.getElementById('card');
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

const printCard = async () => {
    const slug = window.location.pathname.split('/').pop();
    let post;
    try {
        const response = await axios.get(`http://localhost:3000/posts/${slug}`);
        post = response.data;
        console.log(post);
        if (post) {
            const cardTemplate = `
                <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div class="px-6 py-4">
                        <p class="text-gray-600 text-sm"><span class="font-bold me-2">${post.author}</span> ${formatDate(post.creation_date)}</p>
                    </div>
                    <img class="h-64 w-full object-cover" src="${post.image}" alt="${post.title}">
                    <div class="px-6 py-4">
                        <div class="font-bold text-xl mb-2">${post.title}</div>
                        <p class="text-gray-700 text-base">${post.content}</p>
                    </div>
                    <div class="px-6 py-4">
                        ${post.tags.map(tag => `<span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">${tag}</span>`).join('')}
                    </div>
                        <a href="http://localhost:3000/posts/${post.slug}/download" class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Download this image
                        </a>
                </div>
            `;
            cardHTML.innerHTML = cardTemplate;
        } else {
            cardHTML.innerHTML = "<p>No post found</p>";
        }
    } catch (err) {
        console.error(err);
        cardHTML.innerHTML = "<p>Error fetching post</p>";
    }
};

printCard();
