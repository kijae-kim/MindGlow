function getTokenFromCookie() {
    const cookies = document.cookie.split(';');

    // 각 쿠키를 반복하면서 토큰을 찾습니다.
    for (let cookie of cookies) {
        const parts = cookie.trim().split('=');

        if (parts[0] === 'userid') {
            console.log(parts[0], ':', parts[1])
            return parts[1];
        }
    }
    return null;
}

function fetchData() {
    const userid = getTokenFromCookie()
    fetch(`http://localhost:8080/diaries/showList/${userid}`)
        .then(response => {
            console.log(response)
            return response.json()
        })
        .then(data => {
            data.forEach(diary => {
                const container = document.getElementById('list')

                const utcDate = new Date(diary.createdAt)
                const koreanTimeOffset = 9 * 60 * 60 * 1000; // 9시간을 밀리초로 변환
                const koreanDate = new Date(utcDate.getTime() + koreanTimeOffset);

                let Kdate = koreanDate.toISOString()
                Kdate = Kdate.replace('T', ' ');
                let indexOfSecondColon = Kdate.indexOf(':', Kdate.indexOf(':') + 1);
                if (indexOfSecondColon !== -1) {
                    Kdate = Kdate.substring(0, indexOfSecondColon);
                }

                const newContent = `
                <p class='title'>제목: ${diary.title}</p>
                <p class='content'>내용: ${diary.text}</p>
                <p class='createAt'>작성일: ${Kdate}</p>
                <button id='${diary._id}' class='delete'>X</button>
            `;
                const newElement = document.createElement('div')
                newElement.innerHTML = newContent

                container.appendChild(newElement);

                const deleteButtons = document.querySelectorAll('.delete');

                // 각 버튼에 클릭 이벤트 리스너 추가
                deleteButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        deleteDiary(diary._id);
                        button.parentElement.remove()
                    });
                });
            })
        })
        .catch(error => {
            console.error('데이터를 불러오는 중 에러가 발생했습니다:', error);
        });
}

function deleteDiary(diaryId) {
    fetch(`http://localhost:8080/diaries/list/${diaryId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('삭제 요청이 실패했습니다.');
            }
            console.log('일기가 삭제되었습니다.');
        })
        .catch(error => {
            console.error('삭제 중 에러가 발생했습니다:', error);
        });
}


window.onload = function () {
    fetchData();
};