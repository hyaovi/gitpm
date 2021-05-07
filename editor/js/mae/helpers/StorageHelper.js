import axiosAndFormsHelper from './AxiosAndFormsHelper.js';

let storage_info;
let storage_namespace = "/account/api/"; // XXX s.yaglov "/account/api/" LOCAL: OK, TEST: 404, PROD: 403

const storageNamespace = namespace => {
    storage_namespace =
        "/" + (namespace ? encodeURIComponent(namespace) + "/" : "");
};

async function storageInfo(refresh) {
    if (!refresh && storage_info) return storage_info;
    const axios = axiosAndFormsHelper.axiosInstance(this);
    storage_info = (await axios.get(storage_namespace + "storage/info")).data;
    return storage_info;
}

const makeFileListFilter = allow_upload => {
    const ext = allow_upload.ideal ? [allow_upload.ideal] : allow_upload.ext;
    const regex = new RegExp("\\.(" + ext.join("|") + ")$", "i");
    return function(file) {
        return (
            file.name &&
            regex.test(file.name) &&
            !/\.__preview__\.[^\.]+$/.test(file.name)
        );
    };
};

async function storageFilterList(url, filter_cb) {
    if (!storage_info) storage_info = await storageInfo.call(this);
    const axios = axiosAndFormsHelper.axiosInstance(this);
    let files = (await axios.get(url)).data ?? [];

    const previews = new Map();

    files.filter(file => {
        const parent_filename = fileNameIsPreviewFor(file.name);
        if (typeof parent_filename === "string") {
            previews.set(parent_filename, file.name);
            return false;
        }
        return true;
    });
    if (filter_cb) files = files.filter(filter_cb);
    files = files.map(
        fileAssignAdditionalCallback(storage_info.container_url, previews)
    );
    return files;
}

const fileAssignAdditionalCallback = (url_prefix, previews) => {
    return file => {
        if (previews.has(file.name)) {
            file.preview_url = url_prefix + previews.get(file.name);
        }
        file.url = url_prefix + file.name;
        file.filename = file.name.split(/\//g).pop();
        file.printname = file.filename
            .replace(/[_\s]+/g, " ")
            .replace(/\.([^\.]+)$/, "")
            .trim();
        if (file.printname === "") file.printname = file.filename;
        return file;
    };
};

async function storageListFilter(filter_cb, dir = "") {
    if (dir.length && dir[0] != "/") dir = "/" + dir;
    const files = await storageFilterList.call(
        this,
        storage_namespace + "storage/list" + dir,
        filter_cb
    );
    return files;
}

async function storageListExamplesFilter(filter_cb, dir = "") {
    if (dir.length && dir[0] != "/") dir = "/" + dir;
    const files = await storageFilterList.call(
        this,
        storage_namespace + "storage/list_examples" + dir,
        filter_cb
    );
    return files;
}

async function storageList(allow_upload, dir) {
    return await storageListFilter.call(
        this,
        allow_upload ? makeFileListFilter(allow_upload) : undefined,
        dir
    );
}

async function storageListExamples(allow_upload, dir) {
    return await storageListExamplesFilter.call(
        this,
        allow_upload ? makeFileListFilter(allow_upload) : undefined,
        dir
    );
}

async function storagePut(put_params, file_uri, body, on_progress) {
    let put_url = put_params;
    if (typeof put_params == "object") {
        const { type, id, var_name = "url" } = put_params;
        put_url = `${storage_namespace}storage/put/${type}/${id}/${var_name}/`;
    } else if (
        typeof put_url == "string" &&
        put_url.indexOf(storage_namespace) !== 0
    ) {
        put_url = storage_namespace + put_url;
    } else {
        put_url = `${storage_namespace}storage/put/`;
    }
    if (!storage_info) storage_info = await storageInfo.call(this);
    const axios = axiosAndFormsHelper.axiosInstance(this),
        put_result = await axios.post(put_url + file_uri, body, {
            onUploadProgress: on_progress
        });
    if (put_result.status === 201) {
        return storage_info.user_url + file_uri;
    } else {
        throw "HTTP " + put_result.status;
    }
}

const fileNameIsPreviewFor = filename => {
    const m = filename.match(/^(.*)\.__preview__\.[^\.]+$/);
    return m ? m[1] : undefined;
};

async function storagePutPreview(parent_file_uri, body, on_progress) {
    const put_params =
        storage_namespace == "/admin/"
            ? undefined
            : { type: "ObjectList", id: 1, var_name: "url" };
    return await storagePut.call(
        this,
        put_params,
        parent_file_uri + ".__preview__.jpg",
        body,
        on_progress
    );
}

async function storagePutPageFile({id, subfolder_type}, file_uri, body, on_progress) {
    const put_params = `storage/put_page/${id}/${subfolder_type}/`;
    return await storagePut.call(
        this,
        put_params,
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPageEnvmapHdr(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'envmap_hdr'},
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPagePreviewJpg(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'preview_jpg'},
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPageMarkerImage(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'marker_image'},
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPageSplashscreenImage(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'splashscreen_image'},
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPageLogoImage(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'logo_image'},
        file_uri,
        body,
        on_progress
    );
}

async function storagePutPagePreloaderImage(id, file_uri, body, on_progress) {
    return await storagePutPageFile.call(
        this,
        {id, subfolder_type: 'preloader_image'},
        file_uri,
        body,
        on_progress
    );
}

async function storageConvert(
    allow_upload,
    file_uri,
    on_new_url,
    on_progress,
    check_interval = 2000
) {
    const ideal_ext = allow_upload.ideal,
        ext = file_uri
            .split(".")
            .pop()
            .toLowerCase();

    if (ideal_ext && ideal_ext !== ext) {
        let convert_result;
        const axios = axiosAndFormsHelper.axiosInstance(this);
        do {
            convert_result = await axios.get(
                storage_namespace +
                    "storage/convert/" +
                    file_uri +
                    "?ext=" +
                    ideal_ext
            );

            if (convert_result.data.new_url && on_new_url) {
                on_new_url(convert_result.data.new_url);
            }

            if (on_progress) on_progress(convert_result.data.progress);

            await new Promise(rv => setTimeout(rv, check_interval));
        } while (!convert_result.data.done);

        if (convert_result.data.new_url) {
            return convert_result.data.new_url;
        } else {
            throw convert_result.data.progress;
        }
    } else {
        if (!storage_info) storage_info = await storageInfo.call(this);
        return storage_info.user_url + file_uri;
    }
}

async function storageDelete(file_uri) {
    if (typeof file_uri === "string") {
        try {
            const axios = axiosAndFormsHelper.axiosInstance(this),
                delete_result = await axios.post(
                    storage_namespace + "storage/delete/" + file_uri
                );
            if (delete_result.status === 204) {
                return true;
            }
        } catch (e) {
            console.warn("delete error", e);
        }
    }
    return false;
}

async function storageDeleteUrl(url) {
    if (!storage_info) storage_info = await storageInfo.call(this);
    const file_uri = CdnUrlToFileUri(url);
    if (!file_uri) return;
    return await storageDelete.call(this, file_uri);
}

const CdnUrlToFileUri = cdn_url => {
    if (!storage_info) throw "call storageInfo() first";
    const file_uri = cdn_url.replace(storage_info.user_url, "");
    if (cdn_url === file_uri) {
        return;
    }
    return file_uri;
};

async function storageListExamplesFonts( value ) {
    return await storageListExamples.call(
        this,
        { ext:[ 'json' ] },
        `Fonts/${value}`
    );
}

export default {
    storageNamespace,
    storageInfo,
    makeFileListFilter,
    CdnUrlToFileUri,

    storageListFilter,
    storageListExamplesFilter,
    storageList,
    storageListExamples,
    storageListExamplesFonts,

    storagePut,
    storagePutPreview,
    storagePutPageEnvmapHdr,
    storagePutPagePreviewJpg,
    storagePutPageMarkerImage,
	storagePutPageSplashscreenImage,
	storagePutPageLogoImage,
	storagePutPagePreloaderImage,

    storageConvert,
    storageDelete,
    storageDeleteUrl
};
