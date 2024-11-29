import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import ActivityFilers from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";


export default observer(function ActivityDashboard() {
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry, setPagingParams, pagination} = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if(activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry.size])
  
    // 原本的滿版 LoadingPage
    // if(activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='Loading Activities...'/>
    // 換成react原生的 PlacrHolder

    return(
        <Grid>
            <Grid.Column width='10'>
                {activityStore.loadingInitial && !loadingNext && activityRegistry.size !== 0
                    ? (
                        <>
                            <ActivityListItemPlaceholder/>
                            <ActivityListItemPlaceholder/>
                        </>
                    )
                    : (
                        <InfiniteScroll pageStart={0} loadMore={handleGetNext} hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages} initialLoad={false} >
                            <ActivityList />
                        </InfiniteScroll>
                    )
                }

                {
                    //手動加載按鈕，按下去才執行 handleGetNext 加載
                    //<ActivityList />
                    //<Button floated="right" content='more...' onClick={handleGetNext} loading={loadingNext} disabled={pagination?.totalPages === pagination?.currentPage} /> 
                }
            </Grid.Column>
                
            <Grid.Column width='6'>
               <ActivityFilers />
            </Grid.Column>

            <Grid.Column width={10}>
                    <Loader active={loadingNext} ></Loader>
            </Grid.Column>
        </Grid>
    )
})