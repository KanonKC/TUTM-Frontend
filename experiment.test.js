function searchRecognizer(input){
    let result
    if(input.includes('youtu.be')){
        console.log(input.split('/')[3])
    }
    else if(input.includes('list=')){
        const videoReg = /list=.*&?/
        result = videoReg.exec(input)[0]
        console.log(result)
        if(result[result.length-1] === '&'){
            console.log(result.slice(5,-1))
        }
        else{
            console.log(result.slice(5))
        }
    }
    else if(input.includes('v=')){
        const videoReg = /v=.*&|v=./
        result = videoReg.exec(input)[0]
        // console.log(result[0],result[0][result[0].length-1])
        if(result[result.length-1] === '&'){
            console.log(result.slice(2,-1))
        }
        else{
            console.log(result.slice(2))
        }
    }
}

const testcases = [
    /* 0 */ "https://www.youtube.com/watch?v=FSCMMah-18o",
    /* 1 */ "FSCMMah-18o",
    /* 2 */ "https://www.youtube.com/watch?v=FSCMMah-18o&list=RDCMUCCG6qI8XjyjUNgZ8jlJp_wQ&start_radio=1&rv=FSCMMah-18o&t=9911",
    /* 3 */ "darkest dungeon 2",
    /* 4 */ "https://youtu.be/m8X4YWLGjB4",
    /* 5 */ "โกหก",
    /* 6 */ "https://www.youtube.com/watch?v=447DpRkd8AI&t=394s",
]
// Video
// Search
// Playlist
// Video From App

searchRecognizer(testcases[2])