// media.js - Script untuk memuat video dari file JSON eksternal
document.addEventListener('DOMContentLoaded', function() {
    const mediaGrid = document.getElementById('media-grid');
    const pagination = document.getElementById('pagination');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let videosData = [];
    let currentPage = 1;
    let itemsPerPage = 6; // Default untuk "all" - 6 video per halaman
    let filteredVideos = [];
    
    // Coba fetch data dari file JSON eksternal
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Pastikan data memiliki properti videos
            if (data && data.videos && Array.isArray(data.videos)) {
                videosData = data.videos;
                filteredVideos = [...videosData];
                updateMediaGrid();
            } else {
                throw new Error('Invalid data format');
            }
        })
        .catch(error => {
            console.error('Error loading videos data:', error);
            
            // Fallback ke data hardcoded jika file JSON tidak bisa diakses
            console.log('Using fallback video data');
            videosData = [
                {
                    id: 1,
                    category: "kriminologi",
                    title: "CRIMINAL JUSTICE SYSTEM",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-dU1YpvhV9h4"
                },
                {
                    id: 2,
                    category: "kriminologi",
                    title: "FORENSIC PSYCHOLOGY",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 3,
                    category: "kriminologi",
                    title: "CRIME ANALYSIS",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 4,
                    category: "opini",
                    title: "SOCIAL MEDIA IMPACT",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 5,
                    category: "opini",
                    title: "CURRENT AFFAIRS",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 6,
                    category: "opini",
                    title: "PUBLIC POLICY",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 7,
                    category: "psikologi",
                    title: "COGNITIVE BEHAVIOR",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 8,
                    category: "psikologi",
                    title: "MENTAL HEALTH",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                },
                {
                    id: 9,
                    category: "psikologi",
                    title: "HUMAN DEVELOPMENT",
                    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen.",
                    youtubeId: "-ktlIHSOOmk"
                }
            ];
            
            filteredVideos = [...videosData];
            updateMediaGrid();
        });
    
    // Filter button click event
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter videos
            const category = this.getAttribute('data-category');
            
            filteredVideos = category === 'all' ? 
                [...videosData] : 
                videosData.filter(video => video.category === category);
            
            // Reset to first page and update grid
            currentPage = 1;
            updateMediaGrid();
        });
    });
    
    // Function to update the media grid
    function updateMediaGrid() {
        // Calculate pagination
        const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentVideos = filteredVideos.slice(start, end);
        
        // Clear current content
        mediaGrid.innerHTML = '';
        
        if (currentVideos.length === 0) {
            mediaGrid.innerHTML = '<div class="no-results">Tidak ada video dalam kategori ini.</div>';
            pagination.innerHTML = '';
            return;
        }
        
        // Generate media items
        currentVideos.forEach(video => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.setAttribute('data-id', video.id);
            mediaItem.style.cursor = 'pointer'; // Menambahkan cursor pointer agar jelas bisa diklik
            
            mediaItem.innerHTML = `
                <div class="media-video">
                    <iframe src="https://www.youtube.com/embed/${video.youtubeId}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                </div>
                <div class="media-content">
                    <span class="media-label">${video.category.toUpperCase()}</span>
                    <h3 class="media-headline">${video.title}</h3>
                    <p class="media-desc">${video.description}</p>
                </div>
            `;
            
            // Add click event to go to detail page
            mediaItem.addEventListener('click', (event) => {
                // Prevent the click event if it was on the iframe (to allow YouTube controls to work)
                if (event.target.tagName.toLowerCase() !== 'iframe') {
                    window.location.href = `video-detail.html?id=${video.id}`;
                }
            });
            
            // Special handling for iframe to allow video controls to work
            const iframe = mediaItem.querySelector('iframe');
            iframe.addEventListener('click', (event) => {
                event.stopPropagation(); // Stop event from bubbling up to parent
            });
            
            mediaGrid.appendChild(mediaItem);
        });
        
        // Update pagination
        updatePagination(totalPages);
    }
    
    // Function to update the pagination
    // Function to update the pagination
    function updatePagination(totalPages) {
        pagination.innerHTML = '';
        
        // Previous button
        if (totalPages > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-nav';
            prevBtn.innerHTML = '&#8592;'; // Left arrow
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateMediaGrid();
                    const mediaSection = document.querySelector('.media-section');
                    mediaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            pagination.appendChild(prevBtn);
        }
        
        // Page buttons - Hanya tampilkan 2 tombol (halaman saat ini dan berikutnya)
        // atau (halaman sebelumnya dan saat ini)
        const startPage = (currentPage === totalPages) ? currentPage - 1 : currentPage;
        const endPage = Math.min(startPage + 1, totalPages);
        
        for (let i = startPage; i <= endPage; i++) {
            // Pastikan i positif dan tidak melebihi total halaman
            if (i > 0 && i <= totalPages) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'page-btn' + (i === currentPage ? ' active' : '');
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    updateMediaGrid();
                    const mediaSection = document.querySelector('.media-section');
                    mediaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
                pagination.appendChild(pageBtn);
            }
        }
        
        // Next button
        if (totalPages > 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-nav';
            nextBtn.innerHTML = '&#8594;'; // Right arrow
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateMediaGrid();
                    const mediaSection = document.querySelector('.media-section');
                    mediaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            pagination.appendChild(nextBtn);
        }
    }
});