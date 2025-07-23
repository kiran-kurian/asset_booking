const timeSlotPickerSource = `
            <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-semibold text-gray-700 mb-4">Select a Time Slot</h3>
                 {#if selectedDate}
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {#each timeSlots as slot}
                            <button 
                                class="p-2 rounded-md text-sm font-medium transition-colors {slot.isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' : slot.isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-100'}"
                                disabled={slot.isBooked}
                                on:click={() => selectTimeSlot(slot.time)}
                            >
                                {slot.time}
                            </button>
                        {/each}
                    </div>
                 {:else}
                    <p class="text-sm text-gray-500 text-center py-8">Please select a date first.</p>
                 {/if}
            </div>

            <script>
                import { createEventDispatcher } from 'svelte';
                export let selectedDate;
                export let bookedSlots; // e.g., { "2025-07-21": ["10:00 AM"] }
                export let selectedTimeSlot = null;

                const dispatch = createEventDispatcher();
                
                const allSlots = [
                    "09:00 AM", "10:00 AM", "11:00 AM",
                    "12:00 PM", "01:00 PM", "02:00 PM",
                    "03:00 PM", "04:00 PM", "05:00 PM"
                ];

                $: timeSlots = allSlots.map(time => {
                    const isBooked = bookedSlots && bookedSlots.includes(time);
                    return {
                        time,
                        isBooked,
                        isSelected: time === selectedTimeSlot
                    };
                });

                function selectTimeSlot(time) {
                    dispatch('selectTimeSlot', time);
                }
            </script>
        `;
