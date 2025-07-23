<!-- src/lib/BookingCalendar.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';
    export let selectedDate = null;

    const dispatch = createEventDispatcher();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    $: calendarDays = generateCalendar(currentYear, currentMonth);

    function generateCalendar(year, month) {
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();
        
        let days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({});
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(year, month, i);
            days.push({
                date: dayDate,
                isToday: dayDate.getTime() === today.getTime(),
                isSelected: selectedDate && dayDate.getTime() === new Date(selectedDate).getTime(),
                isPast: dayDate < today
            });
        }
        return days;
    }

    function prevMonth() {
        date.setMonth(date.getMonth() - 1);
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
    }

    function nextMonth() {
        date.setMonth(date.getMonth() + 1);
        currentMonth = date.getMonth();
        currentYear = date.getFullYear();
    }

    function selectDate(d) {
        const dateString = d.toISOString().split('T')[0];
        dispatch('selectDate', dateString);
    }
</script>

<div class="bg-white p-4 rounded-xl shadow-md">
    <div class="flex items-center justify-between mb-4">
        <button on:click={prevMonth} class="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Previous month">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h3 class="font-semibold text-gray-800 text-center">{monthNames[currentMonth]} {currentYear}</h3>
        <button on:click={nextMonth} class="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Next month">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-400 mb-2">
        {#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as day}
            <div>{day}</div>
        {/each}
    </div>
    <div class="grid grid-cols-7 gap-1">
        {#each calendarDays as day}
            {#if day.date}
                <button 
                    class="w-full aspect-square rounded-full text-sm transition-colors flex items-center justify-center disabled:cursor-not-allowed"
                    class:bg-blue-600={day.isSelected}
                    class:text-white={day.isSelected}
                    class:font-bold={day.isSelected}
                    class:hover:bg-blue-100={!day.isSelected && !day.isPast}
                    class:text-blue-600={day.isToday && !day.isSelected}
                    class:font-semibold={day.isToday && !day.isSelected}
                    class:text-gray-400={day.isPast}
                    disabled={day.isPast}
                    on:click={() => selectDate(day.date)}
                >
                    {day.date.getDate()}
                </button>
            {:else}
                <div></div>
            {/if}
        {/each}
    </div>
</div>
