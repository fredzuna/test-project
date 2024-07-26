const label = `
<html>

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
</head>

<body>
    <div class="invoice-box">
        <h1>
            {{first_name}} {{last_name}}
        </h1>
        Company: {{company}}
        <br> address: {{address}}
        <br> State: {{state}}
        <br> City: {{city}}
        <br> Zip Phone: {{zip_phone}}
    </div>
</body>

</html>
`

export default label;