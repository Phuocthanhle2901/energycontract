package com.example.questionbankandroid.ui.changepass

import android.content.Intent
import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.navigation.fragment.findNavController
import com.example.questionbankandroid.LoginActivity
import com.example.questionbankandroid.R
import com.example.questionbankandroid.data.DataUtil
import com.example.questionbankandroid.databinding.ChangePasswordFragmentBinding
import com.example.questionbankandroid.service.Retrofit
import kotlinx.coroutines.*
import java.net.SocketTimeoutException

class ChangePasswordFragment : Fragment() {
    private lateinit var binding: ChangePasswordFragmentBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = ChangePasswordFragmentBinding.inflate(inflater, container, false)

        binding.back.setOnClickListener {
            if(DataUtil.CURRENT_USER!!.role == 1){
                findNavController().navigate(R.id.action_changePasswordFragment_to_homeFragment)
            }else{
                findNavController().navigate(R.id.action_changePasswordFragment3_to_adminHomeFragment)
            }
        }
        val email = DataUtil.CURRENT_USER!!.email!!
        binding.pass.visibility = View.GONE
        binding.confirmpass.visibility = View.GONE
        binding.update.visibility = View.GONE
        binding.cp.visibility = View.GONE
        binding.op.visibility = View.VISIBLE
        binding.np.visibility = View.GONE

        binding.displayEmail.setText(email)

        changePassword(email)

        return binding.root
    }

    private fun changePassword(email: String) {
        binding.next.setOnClickListener {
            val pass = binding.passold.text.toString()
            if (pass.length < 6) {
                binding.passold.error = "Password at least 6 character!"
            } else {
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val check  = Retrofit.getRetrofit().confirmAccount(email, pass)
                        if(check == "yes"){
                            requireActivity().runOnUiThread {
                                binding.passold.visibility = View.GONE
                                binding.pass.visibility = View.VISIBLE
                                binding.confirmpass.visibility = View.VISIBLE
                                binding.update.visibility = View.VISIBLE
                                binding.cp.visibility = View.VISIBLE
                                binding.op.visibility = View.GONE
                                binding.np.visibility = View.VISIBLE
                            }
                        }else{
                            requireActivity().runOnUiThread {
                                Toast.makeText(requireContext(), "Password is not correct!", Toast.LENGTH_SHORT).show()
                            }
                        }

                    } catch (e: SocketTimeoutException) {
                    } catch (e: Exception) {
                        Log.d("LoginThongBao", e.message!!)
                    }
                }
            }
        }
        binding.update.setOnClickListener {
            val newPass = binding.pass.text.toString()
            val confirmPass = binding.confirmpass.text.toString()
            if (newPass.length < 6) {
                binding.pass.error = "Password at least 6 character!"
            }else if(newPass[0] == ' '){
                binding.pass.error = "Password can not space character!"
            }else if(newPass != confirmPass){
                binding.confirmpass.error = "Confirm password is not match!"
            }
            else {
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val userInfoModel = Retrofit.getRetrofit().changePassword(email, newPass)
                        requireActivity().runOnUiThread {
                            Toast.makeText(
                                requireContext(),
                                "Change Password Successfully!",
                                Toast.LENGTH_SHORT
                            ).show()
                            val intent = Intent(requireContext(), LoginActivity::class.java)
                            requireContext().startActivity(intent)
                            requireActivity().finish()
                        }
                    } catch (e: Exception) {
                    }
                }
            }
        }

    }

}