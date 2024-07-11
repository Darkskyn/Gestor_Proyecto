import React from 'react'

const Section = () => {
  return (
    <div class="w-full flex justify-center p-1 mb-4">
        <div class="relative w-full">
            <input type="text" class="w-full text-blue-900 placeholder-blue-900 backdrop-blur-sm bg-[#0d30a1]/20 py-2 pl-10 pr-4 rounded-lg focus:outline-none border-2 border-[#0d30a1] focus:border-blue-500 transition-colors duration-300" placeholder="Buscar..."/>
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-blue-900 dark:text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
        </div>
    </div>
  )
}

export default Section
