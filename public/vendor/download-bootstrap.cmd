@echo off
REM Descarga Bootstrap 5 (CSS y bundle JS) a public/vendor/bootstrap
mkdir "%~dp0bootstrap" 2>nul
cd /d "%~dp0bootstrap"
echo Descargando Bootstrap CSS...
curl -L -o bootstrap.min.css https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
echo Descargando Bootstrap JS bundle...
curl -L -o bootstrap.bundle.min.js https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js
echo Listo. Archivos guardados en: %~dp0bootstrap
echo Puedes referenciar estos archivos localmente desde /public/vendor/bootstrap/
pause
