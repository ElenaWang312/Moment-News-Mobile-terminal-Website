fis.match("**.less",{
    parser:"less",
    rExt:".css",
    optimizer: 'clean-css'
})
fis.match("**.tsx",{
    parser:"babel2",
    rExt:".js"
})
fis.match("**.{js,tsx}",{
	optimizer:"uglify-js",
})