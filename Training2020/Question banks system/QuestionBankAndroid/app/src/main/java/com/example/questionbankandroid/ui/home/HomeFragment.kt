package com.example.questionbankandroid.ui.home

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.questionbankandroid.R
import com.example.questionbankandroid.adapter.ThemeQuestionAdapter
import com.example.questionbankandroid.data.ThemeQuestionModel
import com.example.questionbankandroid.databinding.FragmentHomeBinding
import java.text.Normalizer
import java.util.regex.Pattern


class HomeFragment : Fragment() {
    private lateinit var viewModel: HomeViewModel
    private lateinit var binding:FragmentHomeBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View{
        // Inflate the layout for this fragment
        binding = FragmentHomeBinding.inflate(inflater,container,false)
        (activity as AppCompatActivity).supportActionBar?.show()
        setHasOptionsMenu(true)

        viewModel = ViewModelProvider(this).get(HomeViewModel::class.java)
        binding.recycleViewHome.setHasFixedSize(true)
        viewModel.listThemeQuestion.observe(viewLifecycleOwner, Observer {
            it?.let {
                binding.recycleViewHome.adapter = ThemeQuestionAdapter(it)
            }

        })
        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        super.onCreateOptionsMenu(menu, inflater)
        inflater.inflate(R.menu.home_menu,menu)

        val search = menu.findItem(R.id.seach).actionView as SearchView
        search.setIconifiedByDefault(true)
        search.queryHint = "Search..."

        //search listener
        search.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                //Khi nhan search tu keyboard
                viewModel.listThemeQuestion.observe(viewLifecycleOwner, Observer {
                    it?.let { list ->
                        val a = mutableListOf<ThemeQuestionModel>()
                        list.forEach {
                            if(it.name.toLowerCase().contains(query!!.toLowerCase().vNToE())){
                                a.add(it)
                            }
                        }
                        binding.recycleViewHome.adapter = ThemeQuestionAdapter(a)
                    }
                })
                return false
            }

            @SuppressLint("DefaultLocale")
            override fun onQueryTextChange(newText: String?): Boolean {
                viewModel.listThemeQuestion.observe(viewLifecycleOwner, Observer {
                    it?.let { list ->
                        val a = mutableListOf<ThemeQuestionModel>()
                        list.forEach {
                            if(it.name.toLowerCase().contains(newText!!.toLowerCase().vNToE())){
                                a.add(it)
                            }
                        }
                        binding.recycleViewHome.adapter = ThemeQuestionAdapter(a)
                    }
                })
                return false
            }

        })
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return super.onOptionsItemSelected(item)
    }

    private fun String.vNToE(): String {
        val temp = Normalizer.normalize(this, Normalizer.Form.NFD)
        val pattern = Pattern.compile("\\p{InCOMBINING_DIACRITICAL_MARKS}+")
        return pattern.matcher(temp).replaceAll("")
    }

}