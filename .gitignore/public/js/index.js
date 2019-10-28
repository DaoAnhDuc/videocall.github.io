const socket = io('https://video2810.herokuapp.com/')
$('.right .video .stream').on('click', function () {
       $('.right .video .stream').removeAttr('id','activeStream');
       ($(this)).attr('id','activeStream');
   });
function openStream(){
  const config = {audio: false, video: true}
  return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideotag, stream){
  const video = document.getElementById(idVideotag);
  video.srcObject = stream;
  video.play();
}

$('#open').on('click', () =>{
  openStream()
  .then(stream =>{
    playStream('localStream', stream);
  })
})

var peer = new Peer({key: 'lwjd5qra8257b9'});
peer.on('open', function(id) {
  $('#myPeer').append(id);
  $('#txtUsername').on('keypress',function(e) {
      if(e.which == 13) {
          const username = $('#txtUsername').val();
          socket.emit('Nguoi-dung-dang-ky', {ten: username, peerId: id});
      }
  });
});
$(document).ready(function() {
  $('#VideoCall').hide();
   // Stuff to do as soon as the DOM is ready
});


socket.on('Co-nguoi-dung-moi', user => {
  $('#listUser').append(`<div id="${user.peerId}">${user.ten}<div>`)
})
socket.on('Danh-sach-user-online', arrUserInfo =>{
  $('#DangNhap').hide(200)
  $('#VideoCall').show(200);
  $('#listUser').html('');
  arrUserInfo.forEach(function(element) {
  // console.log(element.ten);
  $('#listUser').append(`<div id="${element.peerId}">${element.ten}<div>`)
  });
});

socket.on('Ai-do-ngat-ket-noi', peerId =>{
  $(`#${peerId}`).remove();
});

socket.on('Dang-ky-that-bai', () => {
  alert('Tên đăng nhập đã tồn tại');
  // $('#txtUsername').val() = "";
})
// Ngoi goi di
$('#btnCall').on('click', () => {
  const id = $('#remoteId').val();
  openStream()
  .then(stream =>{
    playStream('localStream', stream);
    const call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  })
})
//Nguoi nhan
peer.on('call', call => {
  openStream()
  .then(stream => {
    call.answer(stream);
    playStream('localStream', stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  })
})

// thuc hien cuoc goi bang click
$('#listUser').on('click', 'div', function(){
  let id = $(this).attr('id');
  openStream()
  .then(stream =>{
    playStream('localStream', stream);
    const call = peer.call(id, stream);
    call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
  })
  // console.log($(this).attr('id'));
})
