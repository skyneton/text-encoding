const encoding = Encoding();

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

    const sortResult = dataSort([...files], (a, b) => 
        [a.name, b.name]
    );

    for(let i = 0; i < sortResult.length; i++) {
        fileEncode(files[i]);
    }
};

document.getElementsByClassName("select_encoding_file")[0].onchange = () => {
    const files = event.target.files || event.dataTransfer.files;

    const sortResult = dataSort([...files], (a, b) => 
        [a.name, b.name]
    );

    for(let i = 0; i < sortResult.length; i++) {
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
    if(!(file.type == "" || file.type.toLowerCase().startsWith("text"))) return;
    const fileDirector = document.getElementsByClassName("encode_result")[0];
    if(fileDirector.style.display == "none") fileDirector.style.display = null;

    const type = document.getElementsByClassName("encoding_type")[0].value;

    const box = document.createElement("div");
    box.setAttribute("class", "encode_result_box");

    const fileName = document.createElement("span");
    fileName.setAttribute("class", "encode_item_fileName not_drag");
    fileName.innerText = file.name;

    const rightBox = document.createElement("div");
    rightBox.setAttribute("class", "encode_result_box_right");
    
    const typeInfo = document.createElement("span");
    typeInfo.setAttribute("class", "before_encoding_type not_drag");
    typeInfo.innerText = type;

    const downloadBtn = document.createElement("button");
    downloadBtn.setAttribute("class", "encode_item_download not_drag");
    downloadBtn.appendChild(loadBox());

    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "encode_item_remove not_drag");
    removeBtn.appendChild(removeSvg());

    rightBox.appendChild(typeInfo);
    rightBox.appendChild(removeBtn);
    rightBox.appendChild(downloadBtn);

    box.appendChild(fileName);
    box.appendChild(rightBox);

    fileDirector.append(box);

    let url;
    encoding.start(file, {
        "type": type,
        success(result, before) {
            result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            url = URL.createObjectURL(new Blob([result], { type: "text/plain" }));

            box.setAttribute("finished", true);
            const temp = [...downloadBtn.children];
            for(let i = 0; i < temp.length; i++) {
                temp[i].remove();
            }
            if(type !== before) {
                typeInfo.innerText = before;
                typeInfo.setAttribute("title", (() => {
                    switch(document.title) {
                        case "텍스트 인코딩 변환 - 텍스트를 UTF-8로 변환": return "감지됨";
                        case "テキストエンコードへんかん - テキストをUTF-8へんかん": return "かんち";
                        default: return "Detected";
                    }
                })());
            }
            downloadBtn.appendChild(downloadSvg());
        }
    });

    removeBtn.onclick = () => {
        if(url != null) URL.revokeObjectURL(url);
        box.remove();
    };

    fileName.onclick = () => {
        if(url) {
            if(fileName.previewSrc != null) window.open(fileName.previewSrc);
            fetch(url).then(r => r.blob()).then(blob => {
                window.open(fileName.previewSrc = URL.createObjectURL(new Blob(["\ufeff", blob], { type: "text/plain" })));
            });
        }
    };

    downloadBtn.onclick = () => {
        if(url) download(url, fileName.innerText);
    };
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
    svg.appendChild(createPath("M382.56,233.376C379.968,227.648,374.272,224,368,224h-64V16c0-8.832-7.168-16-16-16h-64c-8.832,0-16,7.168-16,16v208h-64 c-6.272,0-11.968,3.68-14.56,9.376c-2.624,5.728-1.6,12.416,2.528,17.152l112,128c3.04,3.488,7.424,5.472,12.032,5.472 c4.608,0,8.992-2.016,12.032-5.472l112-128C384.192,245.824,385.152,239.104,382.56,233.376z"));
    svg.appendChild(createPath("M432,352v96H80v-96H16v128c0,17.696,14.336,32,32,32h416c17.696,0,32-14.304,32-32V352H432z"));
    return svg;
};

const removeSvg = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "remove_svg");
    svg.setAttribute("viewBox", "0 0 512 512");
    svg.appendChild(createPath("m240 240h30v165h-30z"));
    svg.appendChild(createPath("m240 240h30v165h-30z"));
    svg.appendChild(createPath("m450 60h-120v-15c0-24.813-20.186-45-45-45h-60c-24.814 0-45 20.187-45 45v15h-120v90h31.248l27.584 317.243c1.191 24.007 20.863 42.757 44.944 42.757h182.447c24.081 0 43.753-18.75 44.944-42.757l27.585-317.243h31.248zm-240-15c0-8.271 6.729-15 15-15h60c8.272 0 15 6.729 15 15v15h-90zm-120 45h330v30h-330zm271.211 375.624c-.336 8.061-6.919 14.376-14.987 14.376h-182.448c-8.068 0-14.651-6.314-14.987-14.376-29.348-337.707-27.341-314.616-27.429-315.624h267.28c-.08.905 1.788-20.569-27.429 315.624z"));
    return svg;
}

const createPath = str => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", str);
    return path;
}

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