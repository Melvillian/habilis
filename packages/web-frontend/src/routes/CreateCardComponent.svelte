<script lang="ts">
    // a component defines two core data things: state and events
    // state is the data that the component needs to render

    // broadly speaking, there are 3 types of state for each UI component:
    // loading, error, and data

    // There's some ways we can handle the state part. Ideally, it would involve *actual* type checking
    // like this:
    // when (state) {
    //   loading: { /* render loading state */ }
    //   data: { /* render data state */ }
    //   error: { /* render error state */ }        
    // }
    // but to my knowledge this is not possible with JS/TS. So, for now, I will use a simple alternative

    type Loading = {
        state: 'loading';
    }

    type Error = {
        state: 'error';
        message?: string;
    }

    type ClozeData = {
        type: 'cloze';
        front: string;
    }

    type QaData = {
        type: 'qa';
        front: string;
        back: string;
    }

    type CreateCardData = ClozeData | QaData;

    type Data = {
        state: 'data';
        data: CreateCardData;
    }

    type UiState = Loading | Error | Data;

    // Note, we'd ideally have this is some sort of generic type and the component would define
    // something like UiState<SpecificComponentDataType>
    export let state: UiState = { state: 'loading' };

    // events are things the user does with the component, for example ClickSubmit or ChangeFront or ChangeBack
    type ClickSubmit = {
        front: string;
        back: string;
    }

    type ChangeFront = {
        newValue: string;
    }

    type ChangeBack = {
        newValue: string;
    }

    type Event = ClickSubmit | ChangeFront | ChangeBack;

    // events are exposed up the tree to an appropriate handler via an eventSink prop
    export let eventSink: (event: Event) => void = defaultEventSink;

    function defaultEventSink(event: Event) {
        console.log('Unhandled event', event);
    }
  
</script>

<!-- Now we produce HTML based on the uiState field, and emit events based on DOM interactions -->

<!-- We'd *love* to have Algebraic Data Types here with exhaustive type matching in a `when`/`switch`/`match` construct
    But alas, no such thing exists. So we manually check via if/else, which is unfortunately much more error-prone.
-->
{#if state.state === 'loading'}
    <div>Loading...</div>
{:else if state.state === 'error'}
    <div>Error: {state.message}</div>
{:else if state.state === 'data'}
    <div></div>
    <!-- Again, we'd love to have ADTs and exhaustive matching checks here, but c'est la vie -->
    {#if state.data.type === 'cloze'}
    <div>Cloze card</div>
        <!-- <CreateClozeCardComponent {state.data} {eventSink} /> -->
    {:else if state.data.type === 'qa'}
    <div>QA Card</div>
        <!-- <CreateQaCardComponent {state.data} {eventSink} /> -->
    {/if}

        <div>
            <input type="text" value={state.data.front} on:input={(e) => eventSink({ newValue: e.target.value })} />
            <button on:click={() => eventSink({ newValue: state.data.front })}>Submit</button>
        </div>
    <!-- {:else if state.data.front && state.data.back}
        <div>
            <input type="text" value={state.data.front} on:input={(e) => eventSink({ newValue: e.target.value })} />
            <input type="text" value={state.data.back} on:input={(e) => eventSink({ newValue: e.target.value })} />
            <button on:click={() => eventSink({ front: state.data.front, back: state.data.back })}>Submit</button>
        </div>
    {/if} -->
    <div>
        <input type="text" value={state.data.front} on:input={(e) => eventSink({ newValue: e.target.value })} />
        <input type="text" value={state.data.back} on:input={(e) => eventSink({ newValue: e.target.value })} />
        <button on:click={() => eventSink({ front: state.data.front, back: state.data.back })}>Submit</button>
    </div>
{/if}

