const encoding = new Encoding();

document.getElementsByClassName("file_select_box")[0].onclick = () => {
    document.getElementsByClassName("select_encoding_file")[0].click();
};

window.ondragover = () => {
    event.stopPropagation();
    event.preventDefault();
};

window.ondrop = () => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.target.files || event.dataTransfer.files;
    for(let i = 0; i < files.length; i++) {
        fileEncode(files[i]);
    }
};

document.getElementsByClassName("select_encoding_file")[0].onchange = () => {
    const files = event.target.files || event.dataTransfer.files;
    for(let i = 0; i < files.length; i++) {
        fileEncode(files[i]);
    }
    event.target.value = null;
}

const dataSort = (data, callback) => {
    const collator = new Intl.Collator("en", {numeric: true, sensitivity: "base"});
    return data.sort((a, b) => {
        const t = callback(a, b);
        return collator.compare(t[0], t[1]);
    });
}

const fileEncode = file => {
    if(!file.type.startsWith("text")) return;
    const fileDirector = document.getElementsByClassName("encode_result")[0];
    if(fileDirector.style.display == "none") fileDirector.style.display = null;

    const box = document.createElement("div");
    box.setAttribute("class", "encode_result_box");
    const fileName = document.createElement("span");
    fileName.setAttribute("class", "encode_item_fileName not_drag");
    const downloadBtn = document.createElement("button");
    downloadBtn.setAttribute("class", "encode_item_download not_drag");
    downloadBtn.appendChild(loadBox());
    fileName.innerText = file.name;
    box.appendChild(fileName);
    box.appendChild(downloadBtn);

    let url;
    encoding.start(file, {
        "type": document.getElementsByClassName("encoding_type")[0].value,
        success(result) {
            url = result;
            box.setAttribute("finished", true);
            const temp = [...downloadBtn.children];
            for(let i = 0; i < temp.length; i++) {
                temp[i].remove();
            }
            downloadBtn.appendChild(downloadSvg());
        }
    });

    fileName.onclick = () => {
        if(url) window.open(url);
    }

    downloadBtn.onclick = () => {
        if(url) download(url, fileName.innerText);
    }

    const sortResult = dataSort([...fileDirector.children, box], (a, b) => 
        [a.getElementsByClassName("encode_item_fileName")[0].innerText, b.getElementsByClassName("encode_item_fileName")[0].innerText]
    );

    for(let i = 0; i < sortResult.length; i++) {
        fileDirector.appendChild(sortResult[i]);
    }
};

const loadBox = () => {
    const box = document.createElement("div");
    box.setAttribute("class", "loading_btn_ani");
    return box;
}

const downloadSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "download_svg");
    svg.setAttribute("viewBox", "0 0 512 512");
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64 c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472 c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z");
    svg.appendChild(path1);
    svg.appendChild(path2);
    return svg;
};

const download = (url, name="name.txt") => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = url;
    link.download = name;
    link.click();
    link.remove();
};

window.onload = () => {
    const temp = document.getElementsByClassName("encoding_type")[0];
    const types = encoding.types();
    for(let i = 0; i < types.length; i++) {
        const option = document.createElement("option");
        option.setAttribute("value", types[i]);
        option.innerText = types[i];
        temp.appendChild(option);
    }
};