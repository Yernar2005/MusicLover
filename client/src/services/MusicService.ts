import {AxiosResponse} from "axios";


import $api from "../http/index.ts";

export interface MusicSummary {
    _id: string,
    Title: string,
    Artist: string,
    coverUrl: string;
}

export interface MusicFull extends MusicSummary {
    Date: string;
    Genre: string[];
    Lyrics?: string;
    Annotation?: string;
    AdditionalInformation?: string;
    MusicType: string;
    CoverType: string;
    audioBase64: string;
}



export interface PageResult {
    items: MusicSummary[];
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export default class MusicService {
    static fetchList (): Promise<AxiosResponse<MusicSummary[]>> {
        return $api.get<MusicSummary[]>('/api/music')
    }

    static fetchById(id:string): Promise<AxiosResponse<MusicFull>> {
        return $api.get<MusicFull>(`/api/music/${id}/full`);
    }

    static audioSrc(id:string){
        return `${$api.defaults.baseURL}/api/music/${id}/audio`
    }
}