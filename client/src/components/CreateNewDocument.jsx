import {React, useState} from 'react'

function CreateNewDocument({user, socket, sessionId, displayedProject}) {
    const [newDocumentTitle, setNewDocumentTitle] = useState("")
    const [newDocumentLanguage, setNewDocumentLanguage] = useState(null)


    function handleCreateNewDocument(e){
        e.preventDefault()
        if(newDocumentLanguage || newDocumentTitle.length === 0){
            alert('Please enter a name and select a language.')
        }else{
            console.log(`'create_new_document_in_project', ${user.id}, ${sessionId}, ${newDocumentTitle}, ${newDocumentLanguage}`)
            // socket.emit('create_new_document_in_project', user.id, sessionId, newDocumentTitle, newDocumentLanguage)
        }
    }

    let validLanguages = [
        "plaintext", 
        "abap", 
        "apex", 
        "azcli", 
        "bat",
        "bicep",
        "cameligo",
        "clojure",
        "coffeescript",
        "cpp",
        "csharp",
        "csp",
        "css",
        "cypher",
        "dart",
        "dockerfile",
        "ecl",
        "elixir",
        "flow9",
        "fsharp",
        "freemarker2",
        "go",
        "graphql",
        "handlebars",
        "hcl",
        "html",
        "ini",
        "java",
        "javascript",
        "julia",
        "kotlin",
        "less",
        "lexon",
        "lua",
        "liquid",
        "m3",
        "markdown",
        "mdx",
        "mips",
        "msdax",
        "mysql",
        "objective-c",
        "pascal",
        "pascaligo",
        "perl",
        "pgsql",
        "php",
        "pla",
        "postiats",
        "powerquery",
        "powershell",
        "proto",
        "pug",
        "python",
        "qsharp",
        "r",
        "razor",
        "redis",
        "redshift",
        "restructuredtext",
        "ruby",
        "rust",
        "sb",
        "scala",
        "scheme",
        "scss",
        "shell",
        "sol",
        "aes",
        "sparql",
        "sql",
        "st",
        "swift",
        "systemverilog",
        "verilog",
        "tcl",
        "twig",
        "typescript",
        "vb",
        "wgsl",
        "xml",
        "yaml",
        "json"
    ]

    let validLanguageOptions = validLanguages.map((validLanguage) => <option key={validLanguage} value={validLanguage}>{validLanguage}</option>)


    let languageSelect = 
        <select className="select flex flex-grow bg-[#3a3a3a]" onChange={(e) => {setNewDocumentLanguage(e.target.value)}}>
            <option disabled selected>Select The Document Language</option>
            {validLanguageOptions}
        </select>

    return (
        <div>
            <h2 className='text-3xl font-semibold'>Create New Document</h2>
            <form onSubmit={e => handleCreateNewDocument(e)} className="flex flex-col gap-2">
                <label className='flex justify-self-start'>Title:</label>
                <input onChange={(e) => setNewDocumentTitle(e.target.value)} className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-300' value={newDocumentTitle} />
                <label className='flex justify-self-start'>Language:</label>
                {languageSelect}
                {newDocumentLanguage? <button type="submit" className="btn btn-ghost">CREATE</button> : null}
            </form>
        </div>
    )
}
export default CreateNewDocument