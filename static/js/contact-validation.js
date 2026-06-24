// 無効なフィールドがある場合にフォーム送信を無効にするスターターJavaScriptの実例
(function() {
  'use strict';

  window.addEventListener('load', function() {
    // カスタムブートストラップ検証スタイルを適用するすべてのフォームを取得
    var forms = document.getElementsByClassName('needs-validation');
    // ループして帰順を防ぐ
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
          form.classList.add('was-validated');
          // validation 失敗
          alert('入力内容を確認してください。');
        } else {
          form.classList.add('was-validated');
          // validation 成功したので、confirm
          if (!window.confirm('この内容で送信しますか？')) {
            return;
          }
          // disable submit button
          var btn = document.getElementById('contact-send');
          btn.disabled = true;
          // loading element
          var loading = document.getElementById('loading');
          loading.classList.remove('loading-hide');
          // send data
          var name = document.getElementById('contact-input-name').value;
          var org = document.getElementById('contact-input-org').value;
          var mailaddr = document.getElementById('contact-input-mail-addr').value;
          var contentmain = document.getElementById('contact-input-content-main').value;
          // 同一オリジンの notifier（nginx 経由で ns-notifier コンテナへ）
          var url = '/api/notify';
          fetch(url, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: 'same-origin',
            cache: 'no-cache',
            body: JSON.stringify({
              name,
              org,
              mailaddr,
              contentmain
            })
          }).then(function(data) {
            console.log('response=' + JSON.stringify(data));
            btn.disabled = false;
            loading.classList.add('loading-hide');
            alert('送信完了');
          }).catch(function(err) {
            console.log('error=');
            console.log(err);
            btn.disabled = false;
            loading.classList.add('loading-hide');
            alert('送信エラー');
          });
        }
      }, false);
    });
  }, false);
})();
