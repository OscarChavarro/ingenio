grep $@ `find . -type f | grep -v "packages" | grep -v ".git" | grep -v ".meteor" | grep -v ".gif" | grep -v ".png" | grep -v ".jpg" | grep -v ".eot" | grep -v ".ttf" | grep -v "svg" | grep -v ".woff" | grep -v ".css" | grep -v node_modules`

