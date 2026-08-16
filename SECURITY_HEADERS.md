# Рекомендуемые заголовки безопасности

Ниже приведён базовый профиль для production-сайта по HTTPS. Его нужно установить на российском хостинге и проверить после каждой смены игровых ресурсов. Заголовки дополняют безопасный код, но не заменяют проверку зависимостей, URL-параметров и пользовательского ввода.

## Рекомендуемый набор

```text
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Frame-Options: DENY
```

Замечания:

- HSTS включайте только после полной настройки HTTPS на основном домене и всех поддоменах. Директиву `preload` не добавляйте без осознанной регистрации и готовности всех поддоменов.
- CSP рассчитана на локальные скрипты, стили, изображения, шрифты и звуки. Не добавляйте `unsafe-eval`. Если библиотека требует ослабления политики, предпочтительно заменить или настроить библиотеку.
- `worker-src 'self' blob:` оставлен для возможных локальных игровых workers. Если они не используются, удалите `blob:` или всю директиву.
- `connect-src 'self'` не разрешает внешнюю аналитику и API. В dev-режиме Vite может требовать WebSocket; production-политику не следует применять к локальному dev-серверу без адаптации.
- `frame-ancestors 'none'` и `X-Frame-Options: DENY` запрещают встраивание сайта на чужие страницы. Если в будущем понадобится доверенная образовательная платформа, изменение должно быть точечным и проверенным.
- Не включайте одновременно несовместимые COOP/COEP-настройки без теста звука, полноэкранного режима, печати и загрузки локальных ресурсов.

## Пример для nginx

Разместите директивы внутри HTTPS-блока `server`:

```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header X-Frame-Options "DENY" always;

location / {
    try_files $uri $uri/ /index.html;
}
```

## Пример для Apache

Требуются модули `mod_headers` и `mod_rewrite`. Правила можно добавить в HTTPS VirtualHost или разрешённый хостингом `.htaccess`:

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  Header always set Cross-Origin-Resource-Policy "same-origin"
  Header always set X-Frame-Options "DENY"
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## Проверка после размещения

1. Откройте главную, вложенный маршрут игры и несуществующий URL напрямую.
2. В DevTools проверьте Console и Network: не должно быть нарушений CSP или запросов к неожиданным доменам.
3. Проверьте заголовки HTML, JS, CSS, изображений и ответа 404 командой `curl -I https://[домен сайта]/` или средствами панели хостинга.
4. Проверьте звук, полноэкранный режим, копирование результата и все локальные игровые ресурсы.
5. Убедитесь, что HTTP перенаправляется на HTTPS и секретные/служебные файлы недоступны.

