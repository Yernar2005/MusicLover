import {makeAutoObservable, runInAction} from 'mobx';


import MusicService, {MusicSummary, MusicFull} from '../services/MusicService.ts';


class MusicStore {
    list: MusicSummary[] = [];
    current?: MusicFull | null = null;
    loading = false;


    constructor() {
        makeAutoObservable(this);
    }


    async loadList() {
        this.loading = true;
        try {
            const {data} = await MusicService.fetchList();
            runInAction(() => {
                this.list = data;
            })
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }


    async loadOne(id: string) {
        this.loading = true;
        try {
            const {data} = await MusicService.fetchById(id);
            runInAction(() => {
                this.current = data;
            })
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    async audioSrc(id: string) {
        return MusicService.audioSrc(id);
    }
}


export default  MusicStore;