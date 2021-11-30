window.onload = async () =>{
    const id = document.querySelector(".userKakaoId").innerHTML;
    let nickname = document.querySelector(".nickName").innerHTML;
    modal = document.querySelector("#nicknameModal").style.display = "none";

    let verifyNickName = await ajaxRequest(
        "GET",
        "http://localhost:8000/api/nickname",
        {id, nickname}
    );

    
    if (verifyNickName["status"] === 200){
        alert("ㅇㅇ");
        
    }else{
        alert("ㄴㄴ");
    }
}