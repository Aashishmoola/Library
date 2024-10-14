// DOM handles
const newBookBtn = document.querySelector("#newBookBtn")
const formCnt = document.querySelector("form")
const displayBtn = document.querySelector("#displayBtn")

// DOM handles within form itself
const titleInput = document.querySelector("#titleInput")
const authorInput = document.querySelector("#authorInput")
const pagesInput = document.querySelector("#pagesInput")
const releaseYearInput = document.querySelector("#releaseYearInput")
const isReadInput = document.querySelector("#isReadInput")
const isNotReadInput = document.querySelector("#isNotReadInput")
const formSubmitBtn = document.querySelector("#submitBtn")

// Books stored in a global array 
const myLibrary = [];

newBookBtn.addEventListener("click", () => {
    formCnt.style.display = "grid"
})

// Constructer for book objects
function Book(title, author, releaseDate, pages, isRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.releaseDate =releaseDate
    this.isRead = isRead
}

// Methods added to prototype (referenced by constructor and each instanciated obj (each does not hold a copy))

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, released in ${this.releaseDate} ,${this.isReadStr}`
}

Book.prototype.createIsReadStr = function () {
    return this.isRead ? "Read" : "Not Read"
}

// Takes inputs from User, creates book object, and stores in global array and resets form
function addBookToLibary() {
    formSubmitBtn.addEventListener("click", () => {
        // Setting default values
        if(authorInput.value === "") authorInput.value = "Author Unknown"
        if(pagesInput.value === "") pagesInput.value = "0"
        if(releaseYearInput.value === "") releaseYearInput.value = "0"

        // Form validation
        if(+pagesInput.value < 0 || +pagesInput.value > 99999) {
            alert("Enter Number of pages between 0 and 99999")
            return
        }

        if(+releaseYearInput.value < 0 || +releaseYearInput.value > 2024) {
            alert("Enter Year of release between 0 and 2024")
            return
        }

        let pagesInputValue = (pagesInput.value === "0") ? "Unknown" : pagesInput.value 
        let releaseYearInputValue = (releaseYearInput.value === "0") ? "Unknown" : releaseYearInput.value 

        const bookObj = new Book(titleInput.value, authorInput.value, releaseYearInputValue, pagesInputValue, isReadInput.checked)

        myLibrary.push(bookObj)

        titleInput.value = authorInput.value = releaseYearInput.value = pagesInput.value = null 
        isReadInput.checked = isNotReadInput.checked = false
    })
}

function displayAllBooks(){
    displayBtn.addEventListener("click", () => {
        // Checking, then removing prexisting table
        const tableEmt = document.querySelector("table")
        if (tableEmt) document.body.removeChild(tableEmt)

        // Generate table
        const generatedTableNode = generateTableOfBooks(myLibrary)

        // Append table to document's body
        document.body.appendChild(generatedTableNode)
    })
}

function generateTableOfBooks(bookLibary) {
    // Get the number of books in global array
    const booksNum = bookLibary.length

    // Array of headers of column in table
    const headers = ["Number", "Title", "Author", "Number of pages", "Year of Release", "Read Status", "Remove Book"]

    const columns = 7

    // Creating new table
    const tblEmt = document.createElement("table")
    const tbodyEmt = document.createElement("tbody")

    // Creating header row
    const headerRowEmt = document.createElement("tr")
    headerRowEmt.classList.add("header")

    headers.forEach((header) => {
        const thEmt = document.createElement("th")
        thEmt.textContent = `${header}`
        thEmt.classList.add("header")
        headerRowEmt.appendChild(thEmt)
    })
    // Appending header row tbody
    tbodyEmt.appendChild(headerRowEmt)
    
    // Creating remaining rows for book properties
    for(let row = 1; row <= booksNum; row++){
        // Creating cells within each row        
        let cell = 0

        const rowEmt = document.createElement("tr")
        rowEmt.classList.add("books", `book${row}`)

        function createNumberedCell (){    
            // Initialise cell to 1
            cell++ 

            const NumberedTdEmt = document.createElement("td")
            NumberedTdEmt.textContent = row
            NumberedTdEmt.classList.add(`bookNum`, `cell${cell}`)
            
            // Appending first numbered cell to row
            rowEmt.appendChild(NumberedTdEmt)
        }
        function createBookPropCells (){
            // Iterating through all key value pairs in book obj in array
            for(let key in bookLibary[row-1]){
                
                // Ensuring that only the object's properties are iterated though
                // and not methods within prototype itself
                let isOwnProp = bookLibary[row-1].hasOwnProperty(key)
                
                // Creating a cell for each property in book obj
                if (isOwnProp){
                    // Incrementing cell count by 1 for each key 
                    cell++
                    
                    const tdEmt = document.createElement("td")
                    tdEmt.classList.add("bookProp", `cell${cell}`)
                    
                    if(key === "isRead") {
                        tdEmt.textContent = bookLibary[row-1].createIsReadStr()

                        const spanCtn = document.createElement("span")
                        const changeReadBtn = document.createElement("button")

                        changeReadBtn.textContent = "Change"
                        changeReadBtn.classList.add("changeReadBtn")
                        spanCtn.classList.add("changeReadBtnCtn")

                        changeReadBtn.addEventListener("click", () => {
                            if (bookLibary[row-1].isRead === false) bookLibary[row-1].isRead = true
                            else bookLibary[row-1].isRead = false

                            tdEmt.textContent = bookLibary[row-1].createIsReadStr()

                            displayBtn.click()
                        })

                        spanCtn.appendChild(changeReadBtn)
                        tdEmt.appendChild(spanCtn)
                    }
                    else {
                        tdEmt.textContent = bookLibary[row-1][key]   
                    }
                    
                    // Appending remaing cells to row
                    rowEmt.appendChild(tdEmt)
                }                     
            }
        }

        function createRemoveBookCell (){
            // Increment cell by 1
            cell++

            // Create button
            const removeBookBtn = document.createElement("button")
            removeBookBtn.textContent = "Remove"
            removeBookBtn.classList.add("removeBookBtn")
            removeBookBtn.addEventListener("click", () => {
                // Removes 1 book from array starting (inclusive) from index:row-1 
                bookLibary.splice(row-1,1)
                displayBtn.click()
            })
            // Create cell and append button to cell
            const removeBookTdEmt = document.createElement("td")
            removeBookTdEmt.classList.add("removeBook", `cell${cell}`)
            removeBookTdEmt.appendChild(removeBookBtn)

            // Append cell to row
            rowEmt.appendChild(removeBookTdEmt)
        }

        createNumberedCell()
        createBookPropCells()
        createRemoveBookCell()
        
        // Appending content rows to tbody
        tbodyEmt.appendChild(rowEmt)
    }
    // Appending tobody to table
    tblEmt.appendChild(tbodyEmt)

    // Returning the table created 
    return tblEmt
}


addBookToLibary()
displayAllBooks()
