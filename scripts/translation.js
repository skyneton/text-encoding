const lang = {
    ko: {
        title: "텍스트 인코딩 변환 - 텍스트를 UTF-8로 변환",
        description: "텍스트 파일 인코딩을 UTF-8로 변환합니다.",
        encodingType: {
            title: "이전 인코딩 형식",
            child: ["자동"],
        },
        fileSelectBox: ["파일 선택", "클릭하거나 텍스트 파일을 드래그 드롭 해주세요."],
    },
    en: {
        title: "Text Encoding Conversion - Convert Text to UTF-8",
        description: "Converts the text file encoding to UTF-8.",
        encodingType: {
            title: "Old encoding format",
            child: ["Auto"],
        },
        fileSelectBox: ["Select File", "Click or drag and drop the text file."],
    },
    jp: {
        title: "テキストエンコードへんかん - テキストをUTF-8へんかん",
        description: "テキストファイルのエンコードをUTF-8にへんかんします。",
        encodingType: {
            title: "前のエンコード形式",
            child: ["自動"],
        },
        fileSelectBox: ["ファイルせんたく", "クリックするかテキストファイルをドラッグドロップしてください。"],
    }
}
const languageSetting = l => {
    switch(l) {
        case "ko": case "ko-KR": {
            const encodingType = document.getElementsByClassName("encoding_type")[0];
            const encodingTypeChild = encodingType.querySelectorAll("[data-lang]");
            encodingType.setAttribute("title", lang.ko.encodingType.title);
            for(let i = 0; i < encodingTypeChild.length; i++) {
                encodingTypeChild[i].innerText = lang.ko.encodingType.child[i];
            }

            const fileSelectBox = document.querySelectorAll(".file_select_box [data-lang]");
            for(let i = 0; i < fileSelectBox.length; i++) {
                fileSelectBox[i].innerText = lang.ko.fileSelectBox[i];
            }

            document.title = lang.ko.title;
            document.getElementsByTagName("html")[0].setAttribute("lang", l);
            document.head.querySelector("meta[name=\"og:title\"]").setAttribute("content", lang.ko.title);
            document.head.querySelector("meta[name=\"og:description\"]").setAttribute("content", lang.ko.description);
            break;
        }
        case "ja": case "ja-JP": {
            const encodingType = document.getElementsByClassName("encoding_type")[0];
            const encodingTypeChild = encodingType.querySelectorAll("[data-lang]");
            encodingType.setAttribute("title", lang.jp.encodingType.title);
            for(let i = 0; i < encodingTypeChild.length; i++) {
                encodingTypeChild[i].innerText = lang.jp.encodingType.child[i];
            }

            const fileSelectBox = document.querySelectorAll(".file_select_box [data-lang]");
            for(let i = 0; i < fileSelectBox.length; i++) {
                fileSelectBox[i].innerText = lang.jp.fileSelectBox[i];
            }
            document.title = lang.jp.title;
            document.getElementsByTagName("html")[0].setAttribute("lang", l);
            document.head.querySelector("meta[name=\"og:title\"]").setAttribute("content", lang.jp.title);
            document.head.querySelector("meta[name=\"og:description\"]").setAttribute("content", lang.jp.description);
            break;
        }
        default: {
            const encodingType = document.getElementsByClassName("encoding_type")[0];
            const encodingTypeChild = encodingType.querySelectorAll("[data-lang]");
            encodingType.setAttribute("title", lang.en.encodingType.title);
            for(let i = 0; i < encodingTypeChild.length; i++) {
                encodingTypeChild[i].innerText = lang.en.encodingType.child[i];
            }

            const fileSelectBox = document.querySelectorAll(".file_select_box [data-lang]");
            for(let i = 0; i < fileSelectBox.length; i++) {
                fileSelectBox[i].innerText = lang.en.fileSelectBox[i];
            }

            document.title = lang.en.title;
            document.getElementsByTagName("html")[0].setAttribute("lang", "en");
            document.head.querySelector("meta[name=\"og:title\"]").setAttribute("content", lang.en.title);
            document.head.querySelector("meta[name=\"og:description\"]").setAttribute("content", lang.en.description);
            break;
        }
    }
}

window.onlanguagechange = () => {
    languageSetting(navigator.language || navigator.userLanguage);
};