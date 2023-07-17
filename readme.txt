git add . && git commit -m "fix window bash scripts" && git push

to kill process on windows:
cmd>
netstat -ano | findstr :9101
//TCP ... *port*

taskkill /PID *port* /F