(function () {
    var CharacterPos = 0;
    var MsgBuffer = "";
    var TypeDelay = 150;
    var NxtMsgDelay = 5000;
    var MsgIndex = 0;
    var delay;
    var MsgArray = ["Hi there! I'm Elijah, a web developer"];

    function StartTyping() {
        var id = document.getElementById("typing-text");
        if (CharacterPos != MsgArray[MsgIndex].length) {
            MsgBuffer = MsgBuffer + MsgArray[MsgIndex].charAt(CharacterPos);
            id.value = MsgBuffer + "_";
            delay = TypeDelay;
            id.scrollTop = id.scrollHeight;
        } else {
            delay = NxtMsgDelay;
            MsgBuffer = "";
            CharacterPos = -1;
            if (MsgIndex != MsgArray.length - 1) {
                MsgIndex++;
            } else {
                MsgIndex = 0;
            }
        }
        CharacterPos++;
        setTimeout(StartTyping, delay);
    }
    StartTyping();
})();

const hamburger = document.querySelector('.hamburger')

hamburger.addEventListener('click', function () {
    this.classList.toggle('is-active');
});